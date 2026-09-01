/**
 * Enterprise Geofencing & Site Containment Engine
 * 
 * Manages spatial circular geofences, site containment matching,
 * entry/exit transition event dispatching, and office proximity calculations.
 */

import { db } from '../database/db';
import { GeofenceDoc, GeofenceEventDoc } from '../database/types';
import { GeodesicService } from './geodesic.service';
import { GeofenceMatch } from './types';

export class GeofenceService {
  /**
   * Evaluates coordinate against all enabled geofences and returns matching sites
   */
  public static findContainingGeofences(latitude: number, longitude: number): GeofenceMatch[] {
    const allGeofences = db.geofences?.getAll() || [];
    const matches: GeofenceMatch[] = [];

    for (const geo of allGeofences) {
      if (!geo.enabled) continue;

      const distMeters = GeodesicService.calculateDistanceMeters(
        latitude,
        longitude,
        geo.latitude,
        geo.longitude
      );

      if (distMeters <= geo.radiusMeters) {
        matches.push({
          geofenceId: geo._id,
          geofenceName: geo.name,
          category: geo.category,
          distanceToCenterMeters: distMeters,
          radiusMeters: geo.radiusMeters
        });
      }
    }

    // Sort by smallest radius first (most specific zone)
    return matches.sort((a, b) => a.distanceToCenterMeters - b.distanceToCenterMeters);
  }

  /**
   * Calculates distance to primary office location in meters
   */
  public static calculateDistanceToPrimaryOffice(latitude: number, longitude: number): number {
    const officeGeofences = db.geofences?.find(g => g.category === 'OFFICE' && g.enabled) || [];
    if (officeGeofences.length === 0) return 0;

    let minDistance = Infinity;
    for (const office of officeGeofences) {
      const dist = GeodesicService.calculateDistanceMeters(
        latitude,
        longitude,
        office.latitude,
        office.longitude
      );
      if (dist < minDistance) {
        minDistance = dist;
      }
    }

    return minDistance === Infinity ? 0 : Math.round(minDistance);
  }

  /**
   * Detects Geofence transitions (ENTER, EXIT) between consecutive updates and logs events
   */
  public static evaluateTransitions(
    employeeId: string,
    employeeName: string,
    prevGeofenceId: string | undefined,
    currentMatches: GeofenceMatch[],
    coords: { latitude: number; longitude: number; accuracy: number; timestamp?: string }
  ): {
    currentGeofenceId?: string;
    currentGeofenceName?: string;
    isInsideGeofence: boolean;
    eventsGenerated: GeofenceEventDoc[];
  } {
    const events: GeofenceEventDoc[] = [];
    const primaryMatch = currentMatches[0];
    const newGeofenceId = primaryMatch ? primaryMatch.geofenceId : undefined;
    const now = coords.timestamp || new Date().toISOString();

    // 1. Check if employee exited previous geofence
    if (prevGeofenceId && prevGeofenceId !== newGeofenceId) {
      const prevGeo = db.geofences?.findById(prevGeofenceId);
      if (prevGeo) {
        // Find latest enter event to compute dwell duration
        const lastEnter = db.geofenceEvents?.find(
          e => e.employeeId === employeeId && e.geofenceId === prevGeofenceId && e.eventType === 'ENTER'
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        let durationMinutes: number | undefined;
        if (lastEnter) {
          durationMinutes = Math.max(
            1,
            Math.round((new Date(now).getTime() - new Date(lastEnter.timestamp).getTime()) / 60000)
          );
        }

        const exitEvent = db.geofenceEvents?.insertOne({
          employeeId,
          employeeName,
          geofenceId: prevGeofenceId,
          geofenceName: prevGeo.name,
          eventType: 'EXIT',
          timestamp: now,
          durationMinutes,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        });
        if (exitEvent) events.push(exitEvent);
      }
    }

    // 2. Check if employee entered a new geofence
    if (newGeofenceId && newGeofenceId !== prevGeofenceId) {
      const enterEvent = db.geofenceEvents?.insertOne({
        employeeId,
        employeeName,
        geofenceId: newGeofenceId,
        geofenceName: primaryMatch.geofenceName,
        eventType: 'ENTER',
        timestamp: now,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy
      });
      if (enterEvent) events.push(enterEvent);
    }

    return {
      currentGeofenceId: primaryMatch?.geofenceId,
      currentGeofenceName: primaryMatch?.geofenceName,
      isInsideGeofence: Boolean(primaryMatch),
      eventsGenerated: events
    };
  }
}
