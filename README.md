# visual.tools

Visual Tools is a complete pipeline for the presentation of complex data as interactive infographics.

> The project caters for coder/designers looking to create novel ways of presenting and interacting with data

> so that they in turn can cater for individuals and organisations engaged in social informatics

> who can in turn empower social groups, community organisations, political discourse, news publishers, manufacturers, etc.

## Justification

At visual.tools we believe that for the World to evolve properly, everybody must have access to accurate data, and to tools with which they can understand and communicate information relevant to their lives.

## Pipeline Design
* Data Store (lovingly called *The Architect*)
  * Raw data import
  * Blueprints built as models of relations between sets of data.
  * Blueprints may be constructed as relations between other Blueprints (composability)
  * Open exploration of data spaces by dynamic linking of Blueprints
  * Summary of data store
* The presentation pipeline
  * Extensibility
  * Meta data for presentation of Fields (Field HUD)
  * Meta data for presentation of the results of calculations (SVGVisualisationDef)
  * Meta data for manipulation of generated visualisations (SVG HUD)

#### Raw data import
The Architect is coded in Python. Any data accessible to Python code (basically everything) can be imported or linked into the data store.

#### Blueprints as models of relations
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

#### Blueprints as compositions of other Blueprints
By Example:
A power station burns coal to produce energy, with efficiency 70%<br>
Another power station might burn gas with some efficiency 73%<br>

The efficiency % defines a relationship between the *energy output by the fuel*<br>
and the *usable energy input to the power station*<br>

The Architect allows the user to ask the question:<br>
>  *If I need 100 KwH of energy, how much CO2 will that produce*<br>
  through defining the efficiency relation between the two blueprints (e.g. power station and coal)<br>

#### Linking Blueprints through Units
By example:
100 lightbulbs, each of 100 Watts, burning for 100 hours = 1,000 KwH

*Any other Blueprint that defines a KwH field (e.g. a power station) can be plugged into the output*

The Architect can create links between any two blueprints, if the blueprints contain any two fields with matching `unit` definition. The Architect at any time, by a social informatic, as part of a campaign, or by any end user as part of open exploration.

Therefore it is possible for the user to ask the question:
> *If I leave my bathroom light on overnight, how much CO2 will that produce.*<br>
  (The fun part of this is including data like Which energy tarriff am I using from Which supplier)<br>

or the user's child to ask:<br>
> *If my parent leaves the bathroom light on overnight, how many delicious fruits could they have bought me instead*
  
  
#### Summary of data store
The data store is designed to contribute "explorable relationships" into the existing arena of open, linked and other data sources. People gain real, visceral, internal context through exploration of relationships, and it is **context** that turns "data" into "information". The code within the Architect strives to make it **easy** for the Information Developer or Social Informatic to encode relationships in a way which can be explored, "fiddled with", composed, tweaked, personalised, etc, by people. 

The Architect is designed to be fast at answering questions about relationships within blueprints. Once a question has been asked once, the Architect memoises everything it can in an efficient manner. It is designed to be able to serve *very large numbers of people*. Each *instance* of a blueprint is called an infogram. An infogram stores all the data necessary to represent the current state of the user fiddling with the relations. Infograms are very light weight, and can be stored / updated / shared / forked efficiently.

### The presentation pipeline
About 3000 lines of (well written) javascript code provide a series of tools for building interactive user interfaces based on the meta data included in the blueprints. There is a *lot* of scope for building any kind of data presentation tools####. The pipeline has Classes for managing interaction with the Architect, which are pretty generic; and currently has some simple, but effective sets of tools for visualising fields; interacting with field values; and visualising the output of calculations as animated SVG's. Basically, it lets users play around and dynamically generate infographics.

#### Extensibility
The pipeline is designed to be pluggable, extensible, etc. all the buzz words. Basically the project caters for coder/designers looking to create novel ways of presenting and interacting with data, so that they in turn can cater for individuals and organisations engaged in social informatics, who can in turn empower social groups, community organisations, political discourse, news publishers, manufacturers, etc.





The focus of visual tools is not so much on data acquisition and homogonisation, but on presentation. We seek to enable individuals and businesses to create effective, impactful visualisations of systems of equations, or linked data, or any other source of valuable knowledge.

A working demo can be found here: https://visual.tools

If you have any questions about usage or developing more tools into the pipeline, please drop us a line. Documentation will follow... by maybe Spring 2017
