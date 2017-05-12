# visual.tools

Visual Tools is a complete pipeline for the presentation of complex data.

## Justification

At visual.tools we believe that for the World to evolve properly, everybody must have access to accurate data, and to tools with which they can understand and communicate information relevant to their lives.

## Pipeline Design
* Raw data import
* Blueprints built as models of relations between datapoints
* Blueprints may be constructed as relations between other Blueprints
* Meta data for presentation of Fields (Field HUD)
* Meta data for presentation of the results of calculations (SVGVisualisationDef)
* Meta data for manipulation of generated visualisations (SVG HUD)

### Raw data import
The Architect is coded in Python. Any data accessible to Python code (basically everything) can be imported or linked into the data store.

### Blueprints as models of relations
* Each collection in the visual.tools data store is called a "blueprint"
  * Blueprints encode three significant sets of data
    > Relationships between fields<br>
    e.g. Volume = Mass * Density; CO2 = emissionsPerKM * Distance; etc<br><br>
    equations can be entered in a relatively simple format, and the architect will build sequences of calculations to implement them sufficiently to allow users to "fiddle with them"
    
    > How to visualise those interactions to the user<br>
    e.g. as a count of something; as the relative size of two things; as ratios of some total; etc
  
    > How to build an interface to allow the user to interact naturally with the relationships<br>
    e.g. readable field names; descriptions of fields; sensible defaults and limits on values
  * Predefined blueprints can import data from linked data (or other accessible data sources)
  * Blueprints can be dynamically built from data sources
* The data store code is designed to be extensible, with focus on easy import of data from any existing source into Blueprint format

### Blueprints as compositions of other Blueprints
e.g. A power station burns coal to produce energy, with some efficiency
Another power station might burn gas with some efficiency.

The efficiency % defines a relationship between the energy output through combustion and the usable electrical energy output by the power station
The Architect automates the construction of the sequence of calculations that allow, e.g. the total amount of CO2 output by the combustion of Coal (defined inside the Coal blueprint), by defining the Kilowatt Hours output by the factory.
Composition of Blueprints allows for the modelling of complex systems, e.g. an entire energy grid, or a transportation network.
The point is not to provide a *store* for such data (there are plenty of those). The point is to represent the relationships between the data, such that the user may interactively explore those relationships ("fiddle with them");


### The presentation pipeline
About 3000 lines of javascript code provide a series of tools for building interactive user interfaces based on t
 
The visual.tools data store provides for import from accessible data source, for both stored and live linked data. 
* 

The focus of visual tools is not so much on data acquisition and homogonisation, but on presentation. We seek to enable individuals and businesses to create effective, impactful visualisations of systems of equations, or linked data, or any other source of valuable knowledge.

A working demo can be found here: https://visual.tools

If you have any questions about usage or developing more tools into the pipeline, please drop us a line. Documentation will follow... by maybe Spring 2017
