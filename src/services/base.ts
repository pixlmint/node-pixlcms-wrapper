import { buildRequest } from "../helpers/xhr"

class BaseService {
    declare domain?: string;
    _buildRequest = buildRequest
}

export { BaseService }
