package samples.passthrough;

import ballerina.lang.message;
import ballerina.net.http;
import ballerina.lang.json;


@BasePath ("/stock")
@Source (interface = "passthroughinterface")
@Service(title = "NYSEService", description = "NYSE service")
service PassthroughService;

actor HttpEndpoint nyse_ep = new HttpEndpoint ("http://localhost:8080/exchange/");

@GET
@PUT
@POST
@Path ("/passthrough")
resource passthrough (message m) {
  var  message response;
  response = http.sendPost (nyse_ep, m);
  reply response;

}
