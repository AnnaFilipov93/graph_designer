import React from 'react';
import { useState} from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import Button from '@material-ui/core/Button';
import './App.css'; 

import data from './data.json';

import {Nodes} from './Nodes';
import {Linkes} from './Linkes';
import { Tojson } from './Tojson';




/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 */
function initDiagram() {
  const $ = go.GraphObject.make;
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,  // must be set to allow the model change listening
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: new go.GraphLinksModel(
          {
            linkKeyProperty: 'key'  //must be defined for merges and data sync when using GraphLinksModel
          })
      });
      // some room around the nodes
      diagram.layout = new go.ForceDirectedLayout();

  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, 'Auto', { desiredSize: new go.Size(50, 50) }, // the Shape will go around the TextBlock
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'Circle',
        { name: 'SHAPE', fill: 'pink', strokeWidth: 0 , stroke: '#b89c87', strokeWidth: 1 },
        // Shape.fill is bound to Node.data.color
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        { margin: 8 },  // some room around the text
        new go.Binding('text').makeTwoWay()
      )
    );
    
  //define a simple Link template
  diagram.linkTemplate =
    $(go.Link, {curve: go.Link.Bezier },
      $(go.Shape),                           // this is the link shape (the line)
      $(go.Shape, { toArrow: "Standard" }),  // this is an arrowhead
      $(go.TextBlock, { margin: 50 , segmentOffset: new go.Point(0, +30) ,font: "bold 12pt sans-serif"  }, // this is a Link label
        new go.Binding("text", "text"))
  );

  return diagram;
}

//For future changes in the graph like add/delete nodes
function handleModelChange(changes) {
  //console.log(changes);

}

//Preper the link array to fit the data that the graph wiil get
//array of arras(with object) to array of objects
function preperToReturnLinks(linkDataArray) {

  let flatLinkArray = [];
  linkDataArray.forEach(element => {
    flatLinkArray = flatLinkArray.concat(element)
  });

  return flatLinkArray;

}


//App component
export default function App(props) {

  //The state of array of the nodes, after a change the graph will rerender
  const [nodeDataArray ,setNodeDataArray] = useState(Nodes(data)) ;
  const linkDataArray = Linkes(nodeDataArray);
  const linkDataArrayCleaned = preperToReturnLinks(linkDataArray);

  //File getter to load, we assume that the data is valid (valid JSON file!!!)
  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result);
      //alert(text);
      setNodeDataArray(Nodes(JSON.parse(text)));
    };
    reader.readAsText(e.target.files[0])
  }

	const handleSubmission = () => {
	};

  return (
    <div className="container">
      <span className="center">
        <ReactDiagram
          initDiagram={initDiagram}
          divClassName='diagram-component'
          nodeDataArray={nodeDataArray}

          //exemple to how the Nodes array need to be -> gojs node format
          // [
          //   { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
          //   { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
          //   { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
          //   { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          // ]
          linkDataArray={linkDataArrayCleaned}

          //Exemple to how the linkes array need to be -> gojs link format
          // [ 
          //   { key: -1, from: 0, to: 1 },
          //   { key: -2, from: 0, to: 2 },
          //   { key: -3, from: 1, to: 1 },
          //   { key: -4, from: 2, to: 3 },
          //   { key: -5, from: 3, to: 0 }
          // ]
    
          onModelChange={handleModelChange}
        
        />
      </span>

      <span className="center">
          <Button className={"save"}
                  variant="contained" color="primary" component="span" size="small"
                  onClick= {() => Tojson(nodeDataArray) }>
            <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(Tojson(nodeDataArray))
                  )}`}
                  download="export.json"
            >
                  {`save`}
            </a>
          </Button>
          <input id="button-Load" type="file" name="file" onChange={(e) => showFile(e)} style={{ display: 'none' }} />
            <label htmlFor="button-Load">
            <Button variant="contained" color="primary" component="span" size="small" onClick={handleSubmission} >
            Load
            </Button>
            </label>
      </span>
    </div>
  );
}