import * as H from 'history';

export interface IRouteInterface {
  path: string;
  exact: boolean;
  name: string;
  render: any;
}
