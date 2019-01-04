export class UpdateLocationAction {
  public static readonly type = '[Location] UpdateLocation'
  constructor(
    public location: {
      city?: any
      address?: string
      position?: { latitude: number; longitude: number }
    }
  ) {}
}
