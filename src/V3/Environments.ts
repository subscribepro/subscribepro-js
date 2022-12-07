import ResourceServiceBase, { ResourceReadable, ResourceUpdateable, ResourceCreateable } from './ResourceServiceBase';

type EnvironmentType = {
  id: number,
  name: string,
  created: string,
  updated: string,
};

type CreateEnvironmentType = {
  name: string,
};

type UpdateEnvironmentType = CreateEnvironmentType

class EnvironmentsServiceBase extends ResourceServiceBase<EnvironmentType> {
  collectionPath() { return "/environments" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const EnvironmentsServiceR = ResourceReadable<typeof EnvironmentsServiceBase, EnvironmentType>(
  EnvironmentsServiceBase
);
const CustomersServiceRU = ResourceUpdateable<typeof EnvironmentsServiceR, EnvironmentType, UpdateEnvironmentType>(
  EnvironmentsServiceR
);
const EnvironmentsService = ResourceCreateable<typeof CustomersServiceRU, EnvironmentType, CreateEnvironmentType>(
  CustomersServiceRU
);


export const Environments = new EnvironmentsService();
export default Environments;