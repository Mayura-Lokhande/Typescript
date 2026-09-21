import { describe, it, expect } from "vitest";

interface UserRequest {
  userId: string;
  action: string;
}

  interface ApiConfig {
  endpoint: string;
  token: string;
}


class HttpClient {

  async request(
    url: string,
    payload: Record<string, unknown>
  ): Promise<Record<string, unknown>> {

    return {
      status: "success",
      data: payload,
      timestamp: Date.now()
    };
  }
}


class UserRepository {

  private storage: Map<string, Record<string, unknown>>;

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
  ): Promise<Record<string, unknown> | undefined> {

    return this.storage.get(id);
  }
}


class ResponseMapper {

  convert(
    response: Record<string, any>
  ): UserProfile {

   
    return {
      identifier: response.data.id,
      displayName: response.data.name,
      access: response.data.role
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
  ): Promise<Record<string, unknown>> {

    const existing =
      await this.repository.findUser(
        request.userId
      );


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
    value: Record<string, any>
  ): UserProfile {

    const mapper =
      new ResponseMapper();

    return mapper.convert(
      value
    );
  }
}



interface DashboardProps {
  title: string;
  items: any[];
  owner: string;
}


function Dashboard(
  props: DashboardProps
): DashboardData {

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
    input: Record<string, any>
  ): Promise<UserProfile> {


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


        expect(
          result
        ).toBeDefined();

      }
    );

  }
); 
