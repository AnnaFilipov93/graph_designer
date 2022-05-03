import {Link} from './Link';

const useLinkDataArray = (nodeDataArray) => {

    //Going through all the nodes and creating links (can be more then 1 per node)
    let linkComponentArray = nodeDataArray.map((node) => node.inputs.map((input) => Link(node.key,extructTo(input.value),getText(input,nodeDataArray)) ));
    return linkComponentArray;
       
}

//Get the text on the links
const getText = (input,nodeDataArray) => { 

    //Get the node id (target)
    let nodeIdTo = extructTo(input.value); // "B"

    //Looking for the node (targer) in the nodearray
    let filterdNode = nodeDataArray.filter(node => node.key === nodeIdTo)[0];  //{key: 'B', name: 'B', metadata: {…}, inputs: Array(1)}

    //Get the text from input.value after the metadata. (value: 'node-B -> metadata.size')
    let inputsMetadataValue = input.value.split(".")[1]; 

    //Get the information from metadata
    let text = filterdNode.metadata[inputsMetadataValue]; // 90kb

    return input.key +": "+ text;

}

//Search for all the upcases and return the first letter (assuming it is consistent)
//To find where the link will point
//Extructed from input.value (node-B -> metadata.age)
const extructTo = (node) => {
    
    const value = node.match(/[A-Z]/g);

    return value[0];
}

//Build the links array of arrays
export const Linkes = (nodeDataArray) =>
{
    const linkDataArray = useLinkDataArray(nodeDataArray);

    return linkDataArray;
};