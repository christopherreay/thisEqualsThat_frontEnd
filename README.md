[![Stories in Ready](https://badge.waffle.io/christopherreay/thisEqualsThat_frontEnd.png?label=ready&title=Ready)](https://waffle.io/christopherreay/thisEqualsThat_frontEnd)
# visual.tools
Visual Tools is a complete pipeline for the presentation of complex data as interactive infographics.

> The project caters for coder/designers looking to create novel ways of presenting and interacting with data

> so that they in turn can cater for individuals and organisations engaged in social informatics

> who can in turn empower social groups, community organisations, political discourse, news publishers, manufacturers, etc.

> current production version: https://visual.tools

## Justification

At visual.tools we believe that for the World to evolve properly, everybody must have access to accurate data, and to tools with which they can understand and communicate information relevant to their lives.

## Pipeline Design
* Data Store (lovingly called *The Architect*)
  * Raw data import
  * Blueprints built as models of relations between sets of data.
  * Blueprints may be constructed as relations between other Blueprints (composability)
  * Open exploration of data spaces by dynamic linking of Blueprints
  * An Infogram is an instance of a Blueprint
  * Summary of data store
* The presentation pipeline
  * Visualisations as Blueprint Metadata
  * Extensibility
  * Presentation of Fields
  * Dynamic Infographics
  * HUD Plugins
    * Input Field HUD - Manipulation of Fields
    * SVG HUD - Manipulation of Infographics

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

#### Blueprints as compositions of other Blueprints ( Symbole `->` )
By Example:
A power station burns coal to produce energy, with efficiency 70%<br>
Another power station might burn gas with some efficiency 73%<br>

The efficiency % defines a relationship between the *energy output by the fuel*<br>
and the *usable energy input to the power station*<br>

The Architect allows the user to ask the question:<br>
>  *If I need 100 KwH of energy, how much CO2 will that produce*<br>
  through defining the efficiency relation between the two blueprints (e.g. power station and coal)<br>

#### Linking Blueprints through Units ( Symbol: `=>` )
By example:
100 lightbulbs, each of 100 Watts, burning for 100 hours = 1,000 KwH

*Any other Blueprint that defines a KwH field (e.g. a power station) can be plugged into the output*

A social informatic, as part of a campaign, or any end user as part of open exploration, can query the Architect and instruct it to dynamically link any Blueprints through fields with matching `unit` definition.
any
Therefore it is possible for the user to ask the question:
> *If I leave my bathroom light on overnight, how much CO2 will that produce.*<br>
  (The fun part of this is including data like Which energy tarriff am I using from Which supplier)<br>

or the user's child to ask:<br>
> *If my parent leaves the bathroom light on overnight, how many delicious fruits could they have bought me instead*

#### The Architect is *fast* at analysing results
The Architect is designed to be fast at answering questions about relationships within blueprints. Once a question has been asked once, the Architect memoises everything it can in an efficient manner. ProcessPath objects recored the route of calculations, and dependency analysis is memoised for each set of equations. 

It is designed to be able to serve *very large numbers of people* fiddling with it.

#### An Infogram is an instance of a Blueprint
Each *instance* of a blueprint is called an infogram. An infogram stores all the data necessary to represent the current state of the user fiddling with the relations. Infograms are very light weight, and can be stored / updated / shared / forked efficiently
  
#### Summary of data store
The data store is designed to contribute "explorable relationships" into the existing arena of open, linked and other data sources. People gain real, visceral, internal context through exploration of relationships, and it is **context** that turns "data" into "information". The code within the Architect strives to make it **easy** for the Information Developer or Social Informatic to encode relationships in a way which can be explored, "fiddled with", composed, tweaked, personalised, etc, by their audience, and easy for the audience to consume and share the experiences.

### The presentation pipeline

#### Visualisations as Blueprint Metadata
> Example:<br>
  Calculate the mass of CO2 produced to light the bathroom overnight<br>
  Visualise the mass as the volume of CO2 at normal density in air
  
Upon consideration, we can see that two sets of the same kind of calculation are required. 
> 1. Calculate the CO2 emissions, as defined by the relations in the Lightbulb=>PowerStation->Coal blueprints

> 2. Calculate the volume of the CO2 at normal CO2 concentraition in air, as defined within the Coal blueprint

Each claculation uses a ProcessPath to produce a result given the current user input.
> Example continued:<br>
  The user changes the desired visualisation to see the volume of pure CO2 gas or perhaps the volume of the CO2 frozen
  
From this perspective, we can see that the Blueprint must encode density data regarding "CO2 at density in air, CO2 pure, CO2 frozen", and must be able to suggest to the user that these are options for visualising the data.

Each one of these options is called a "VisualisationMeta". Visualisation meta data can be quite complex, involving mathematics, color choices, display plugin options, and anything else necessary to generate the desired visualisation.

> The process of creating new visualisation tools in the pipeline usually begins with additions to blueprint meta data, which can then be passed through to any javascript plugins

#### Javascript "Front End"
About 3000 lines of (well written) javascript code provide a series of tools for building interactive user interfaces based on the meta data included in the blueprints. There is a *lot* of scope for building any kind of data presentation tools. The codebase includes Classes for managing interaction with the Architect, which are pretty generic; and currently has some simple, but effective sets of tools for visualising fields; interacting with field values; and visualising the output of calculations as animated SVG's. Basically, it lets users play around and dynamically generate infographics.

#### Extensibility
The pipeline is designed to be pluggable, extensible, etc. all the buzz words. Basically the project caters for coder/designers looking to create novel ways of presenting and interacting with data, so that they in turn can cater for individuals and organisations engaged in social informatics, who can in turn empower social groups, community organisations, political discourse, news publishers, manufacturers, etc.

#### Presentation of Fields
By default, the base code presents:
* all input fields defined by a blueprint, each in a row
* in random order (since they are python dict keys)
* with their computer readable names (the python dict keys)
* a slider, select list or input box as a control
  * the slider input style also has an input box to allow typing of specific values
* display of the unit for the field

Any manipulation of the input field values is immediately sent to the Architect, which performs calculations and returns the results. Changes to field values made by the user before the Architect returns, are placed in a queue, and sent one by one, each sending waiting for the Architect to return the new values.

In general (not necessarily) the results returned from the Architect cause the SVG Visualisation to update.

#### SVG Visualisation Component
The SVG Visualisation Component provides major functionality for visual.tools

> Dyanmically generates, in real time, 2.5D, SVG Infographics<br>
> <br>
> the graphic generally consists of the main visualisation; a reference visualisation (ant, person, eiffel tower, etc); axis with size indicator; a text description<br>
> <br>
> This is just the list of stuff it does now. There are a huge range of possibilities for visualisation techniques. The existing implementations allow for represetation of: volume; number (scalar values); ratio, but not, for example: Time; or Geographical Location. The pipeline as a whole is designed to make it simple to implement new SVG Visualisation styles, and add them to blueprint metadata.

> Allows blueprints to specify as metadata how to generate the visualisation

> Presents access to javascript objects (through the SVG HUD) to interact with the visualistion in real time

> Provides tools to save and share generated visualisations

#### The Input Field HUD and the SVG HUD
Both the InputField and the SVG HUD plugin infrastructures use the pattern of "hooks", and allow javascript code to arbitrarily alter the default generated output. 

Currently there are 5 hooks implemented in the code base, but there are no structural reasons or limitations on adding more hooks wherever useful. There are currently three InputFieldHUD plugins implemented and five or six SVGHUD plugins implemented. Especially the InputFieldHUD plugins have some fairly complex patterns implemented which allow them to interact predictably as the user fiddles with the infogram.

The (current) HUD hooks are:
1. init
2. preclone
3. postclone
4. precolor
5. postcolor

#### Input Field HUD

* **Field Order plugin**
  * Human readable field names
  * Field groups (with headers)
  * Arbitrary text in a field row
  * Info popup (html) content for any row (field, field group header or text rows)
* **Remove Field plugin**
  * remove any field from being displayed
* **Ratio Color plugin**
  * this plugin creates the controls specifically for the Percentage widget (https://visual.tools/blueprint/Percentage)
  * It interacts with the VisualisationSVG in realtime, and memoises various data as the user reloads content from the Architect.

> The `Ratio Color plugin` contains techniques/patterns which can be used to build many complex and interesting tools for interactive data visualisation

#### SVG HUD
* Each SVG HUD plugin can introduce any number of menu items above the SVG Visualisation
* Data memoisation and cookie management is provided for
* Blueprint metadata can automatically call SVG HUD plugins when the Visualisation has rendered

* **SVG 3d Clone Timer**
  * determines the amount of time expected to render the requested SVG (before rendering)
  * alerts the user if it will take more than 5 seconds to render, and allows the user to cancel
    * sometimes people (deliberately or accidentally) attempt to, for example, draw 50,000 lightbulbs or people. Whilst the tech will happily do this, its nice to know that it will take 15 seconds or 20 minutes or whatever to render the image, especially if you did it by mistake.
  * informs the user of the expect amount of time to render
  * uses cookies to become more accurate over time on any specific device
* **Reference SVG Select**
  * by default, the SVG Visualisation picks a natural reference SVG (ant, person, eiffel tower)
  * the plugin allows the user to select their own choice from a list (fun!, sometimes stupid)
* **Toggle Features**
  * switch on and off display of:
    * Axes
    * Reference Visualisation
    * Text Description
* **Fill Manager**
  * Blueprint metadata may define any number of color pickers for each Visualisation Def
  * each color picker may define any algorithm to interact with the CSS colors of the SVG
    * e.g. this is used to create the 3d shading effect when coloring the cube (https://visual.tools/blueprint/HowMuch), where the front/back, top/bottom, side/side are each the same shade, but slightly different to each other, using the picked color as a base
* **Randomise Clones**
  * Presents three menu items to the user
    1. `Position`<br>
       allows the user to determine how irregularly the clones are laid out from "perfectly uniform"
    2. `Detail Color`<br>
       allows the user to randomise the color of every individual path in every clone slightly
    3. `Group Color`<br>
       allows the user to randomise the color of all the paths in each cloned image<br>
  * This plugin is often used automatically by blueprints to give a more organic feel to the generated images
  * I thought it was nuts, but its actually really good
    * you can fiddle with it here: (https://visual.tools/blueprint/HowMany). When the page loads you can see that each tree is slightly off centre from perfect layout, each branch is a slightly different color in detail, and each tree has an overall slightly different hue. Cool. And you can do silly things with it :)
