import { State, Action, StateContext } from '@ngxs/store'
import { UpdateLocationAction } from '../action/location.action'

@State({
  name: 'location',
  defaults: {}
})
export class LocationState {
  @Action(UpdateLocationAction)
  public login<T>(
    { setState, getState }: StateContext<any>,
    { location }: UpdateLocationAction
  ) {
    const last = getState()
    setState({ ...last, ...location })
  }
}
