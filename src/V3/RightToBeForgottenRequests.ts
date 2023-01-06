import ResourceServiceBase, { ResourceReadable, ResourceSearchable, ResourceCreateable } from './ResourceServiceBase';

type RightToBeForgottenRequestType = {
  id: number,
  environmentId: number,
  status: string,
  receivedDateTime: string,
  processedDateTime: number,
  customerId: string,
  email: string,
  platformSpecificCustomerId: string,
  phone: string,
  firstName: string,
  middleName: string,
  lastName: string,
  notes: string,
  created: string,
  updated: string,
};

type CreateRightToBeForgottenRequestType = Partial<
  Omit<
    RightToBeForgottenRequestType,
    "id" | "status" | "processedDateTime" | "created" | "updated"
  >
>;

type RightToBeForgottenRequestSearchParams = {
  page?: number,
  itemsPerPage?: number,
};

class RightToBeForgottenRequestsServiceBase extends ResourceServiceBase<RightToBeForgottenRequestType> {
  collectionPath() { return "/right-to-be-forgotten-requests" };
  resourcePath({id}:{id:string|number}) { return `${this.collectionPath()}/${id}` };

};

const RightToBeForgottenRequestsServiceReadable = ResourceReadable<
  typeof RightToBeForgottenRequestsServiceBase, RightToBeForgottenRequestType
>(RightToBeForgottenRequestsServiceBase);
const RightToBeForgottenRequestsServiceSearchRead = ResourceSearchable<
  typeof RightToBeForgottenRequestsServiceReadable, RightToBeForgottenRequestType, RightToBeForgottenRequestSearchParams
>(RightToBeForgottenRequestsServiceReadable);
const RightToBeForgottenRequestsService = ResourceCreateable<
  typeof RightToBeForgottenRequestsServiceSearchRead, RightToBeForgottenRequestType, CreateRightToBeForgottenRequestType
>(RightToBeForgottenRequestsServiceSearchRead);

export const RightToBeForgottenRequests = new RightToBeForgottenRequestsService();
export default RightToBeForgottenRequests;