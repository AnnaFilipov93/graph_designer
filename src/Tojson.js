
export const Tojson = (nodeDataArray2) => {

    let nodeDataArray = JSON.parse(JSON.stringify(nodeDataArray2)); //Lazy way to deep copy

    for (let i = 0; i < nodeDataArray.length; i++) {
        let inputJson = {}
        for (let j = 0; j < nodeDataArray[i].inputs.length; j++) {//Convert input array to json
            let currInput = nodeDataArray[i].inputs[j];
            inputJson = {...inputJson, ...Inputs(currInput.key, currInput.value)}//Add single input to input json
        }
        // override inputs array with inputs JSON
        nodeDataArray[i].inputs = inputJson;
    }

    //Change all Node format
    for (let i = 0; i < nodeDataArray.length; i++) {
        nodeDataArray[i] = NodeReverse(nodeDataArray[i].text,nodeDataArray[i].metadata,nodeDataArray[i].inputs);
    }
    
    const nodes = {};
    //Convert node array to node JSON
    for (let i = 0; i < nodeDataArray.length; i++) {
        nodes["node-"+nodeDataArray[i].name] = nodeDataArray[i];
    }
    //Constructing output JSON
    const finalJson = {
        "name" : "Output Graph",
        "nodes" : nodes
    }

  
    return finalJson;
}

export const Inputs = (keyData,valueData) => {

    return { [keyData] : valueData }

}


//Return object 
export const NodeReverse = (name,metadata,inputs) => {

    return {name: name , metadata : metadata , inputs: inputs}

}