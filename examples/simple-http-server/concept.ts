import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { HttpServer } from "./containers/http-server.container";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { HTTPErrorHandler } from "./components/http-error-handler.component";
import { HTTPRequestHandler } from "./components/http-request-handler.component";


(async () => {
    const simpleConcept = new A_Concept({
        name: 'test-server',

        containers: [
            new HttpServer({
                components: [
                    HTTPErrorHandler,
                    HTTPRequestHandler
                ]
            })
        ],
        fragments: [
            new A_Config({
                variables: ['PORT'],
                defaults: {
                    PORT: 3030,
                }
            })
        ],
    })


    await simpleConcept.load();

    await simpleConcept.start();

})();
