import {Node} from './Node';

//Get JSON data and convert to array of objects
const useDataArray = (data) => {

    //Get the nodes as array of key:node-name and value:{all the information}
    const arrayOfNodes = extruct(data['nodes']);
    //Get array of objects just of values (the input still not separated to key and value)
    const extructedNodeValues = arrayOfNodes.map((nodes) => nodes['value']);
    
    //Create an array of Nodes
    const nodeComponentArray = extructedNodeValues.map((node) => Node(node.name,node.name,node.metadata,extruct(node.inputs)));

    return nodeComponentArray;
      
}

//extruct the key and value to separate named key and value ==> array with object with key and value
const extruct = (data) => {

    const arrayOfObjects = [];

    for (let [key, value] of Object.entries(data)) {
        arrayOfObjects.push({key,value});
    }
    console.log("arrayOfObjects: ", arrayOfObjects);
    return arrayOfObjects;

}

//Return array of Node objects
export const Nodes = (data) =>
{
    const nodeDataArray = useDataArray(data) ;

    return nodeDataArray;
};