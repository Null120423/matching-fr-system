declare class CoordinatesDto {
    lat: number;
    lng: number;
}
declare class LocationDto {
    address: string;
    name: string;
    coordinates: CoordinatesDto;
}
export declare class CreateAppointmentDto {
    activity: string;
    activityType: string;
    date: string;
    time: string;
    duration: number;
    location: LocationDto;
    notes: string;
    toUserId: string;
}
export {};
