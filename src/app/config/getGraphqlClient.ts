
import { GraphQLClient } from "graphql-request";

// should reinit graph client on chain changed;

let baseBlockClient: GraphQLClient;
let perpetualClient: GraphQLClient;
let baseClient:GraphQLClient;



export const initGraphqlClient = (baseBlockUrl: string, perpetualUrl: string, baseGraphqlUrl: string) => {

    baseBlockClient = new GraphQLClient(baseBlockUrl, {
        headers: {}
    });

    perpetualClient = new GraphQLClient(perpetualUrl, {
        headers: {}
    });

    baseClient = new GraphQLClient(baseGraphqlUrl, {
        headers: {}
    });
}


export const getGraphqlClient = () => {

    return {
        baseBlockClient,
        perpetualClient,
        baseClient,
    }
}





 