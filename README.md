# visual.tools

Visual Tools is a complete pipeline for the presentation of complex data.

## Justification

At visual.tools we believe that for the World to evolve properly, everybody must have access to accurate data, and to tools with which they can understand and communicate information relevant to their lives.

## Design
### The Data Store (lovingly called "The Architect")
* Each collection in the visual.tools data store is called a "blueprint"
  * Blueprints encode three significant sets of data
    > Relationships between fields<br>
    e.g. Volume = Mass * Density; CO2 = emissionsPerKM * Distance; etc
    
    > How to visualise those interactions to the user<br>
    e.g. as a count of something; as the relative size of two things; as ratios of some total; etc
  
    > How to build an interface to allow the user to interact naturally with the relationships<br>
    e.g. readable field names; descriptions of fields; sensible defaults and limits on values
  * Predefined blueprints can import data from linked data (or other accessible data sources)
  * Blueprints can be dynamically built from data sources
* The data store code is designed to be extensible, with focus on easy import of data from any existing source


### The presentation pipeline
About 3000 lines of javascript code provide a series of tools for building interactive user interfaces based on t
 
The visual.tools data store provides for import from accessible data source, for both stored and live linked data. 
* 

The focus of visual tools is not so much on data acquisition and homogonisation, but on presentation. We seek to enable individuals and businesses to create effective, impactful visualisations of systems of equations, or linked data, or any other source of valuable knowledge.

A working demo can be found here: https://visual.tools

If you have any questions about usage or developing more tools into the pipeline, please drop us a line. Documentation will follow... by maybe Spring 2017
