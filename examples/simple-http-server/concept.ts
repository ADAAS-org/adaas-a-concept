import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { DefaultHttpServer } from "./containers/http-server.container";
import { HttpServer } from "./contexts/http-server.namespace";


(async () => {
    const simpleConcept = new A_Concept({
        name: 'test-server',
        // import: [
        //     server1,
        //     server2
        // ],
        containers: [
            DefaultHttpServer
        ],
        context: [
            new HttpServer({
                port: 3000
            }),
            new HttpServer({
                port: 3001
            })
        ],
    })



    await simpleConcept.run();

})();
