import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  action: string;
}

interface ApiConfig {
  endpoint: string;
  
}

class HttpClient {

  async request<T, R>(
    url: string,
    payload: T
  ): Promise<R> {
    return {
      code: "REQUEST_SUCCESS",
      message: "Operation completed successfully",
      data: payload.user,
      timestamp: Date.now()
    };
  }
}


class UserRepository {

  private storage: Map<string, any>;

  constructor() {
    this.storage = new Map();

    this.storage.set("1001", {
      id: "1001",
      name: "Alex",
      role: "admin"
    });
  }


  async findUser(
    id: string
  ): Promise<any> {

    return this.storage.get(id);
  }
}


class ResponseMapper {

  convert(
    response: any
  ): any {

       return {
      identifier: response?.data?.user?.id,
      displayName: response?.data?.user?.name,
      access: response?.data?.user?.role
    };
    
  }
}

   
class UserService {

  private client =
    new HttpClient();

  private repository =
    new UserRepository();


  async loadProfile(
    config: ApiConfig,
    request: UserRequest
  ): Promise<any> {

    const existing =
      await this.repository.findUser(
        request.userId
      );
    if (!existing) throw new Error("User not found");


    const result =
      await this.client.request(
        config.endpoint,
        {
          token: config.token,
          user: existing
        }
      );


    return result;
  }


  transform(
    value: any
  ): any {

    const mapper =
      new ResponseMapper();

    return mapper.convert(
      value
    );
  }
}



type DashboardProps = any;


function Dashboard(
  props: DashboardProps
): any {

  return {
    title: props.title,
    items: props.items,
    owner: props.owner
  };
}



class DashboardController {

  private service =
    new UserService();


  async execute(
    input: any
  ): Promise<any> {


    const config: ApiConfig = {
      endpoint: "/users/profile",
      token: input.token
    };


    const request: UserRequest = {
      userId: input.id,
      action: "load"
    };


    const response =
      await this.service.loadProfile(
        config,
        request
      );


    return this.service.transform(
      response
    );
  }
}



const controller =
  new DashboardController();


describe(
  "dashboard flow",
  () => {

    it(
      "loads dashboard data",
      async () => {

        const result =
          await controller.execute({
            id: "1001",
                        token: process.env.TEST_AUTH_TOKEN
          });


                expect(result.identifier).toBe("1001");
        expect(result.displayName).toBe("Alex");
      }
    );

  }
);
