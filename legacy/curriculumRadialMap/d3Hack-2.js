ljdj = {};
ljdj.init = function()
{ var countKeys = function(o)
  { count = 0;
    for (p in o)
    { if (o.hasOwnProperty(p))
      { count++;
      }
    }
    return count;
  }

  var vis = d3.select("#displayLJDJ").append("svg")
  var pi = Math.PI;

  var achievementLevels =
      { developing: 0.1,
        consolidating: 0.4,
        secure: 0.9
      };
  styleDict = {};

  var threadStyles = function(styleDict, threadName, rgb)
  { styleDict[threadName] = {};
    for (achievementLevel in achievementLevels)
    { styleDict[threadName][achievementLevel] =
      "."+threadName+"_"+achievementLevel+" { fill: rgba("+rgb.join()+","+achievementLevels[achievementLevel]+"); }"
    };
  };
  var writeStylesToDocument = function(styleDict)
  { styleDictString = "";
    for (threadName in styleDict)
    { for (achievementLevel in achievementLevels)
      { styleDictString += styleDict[threadName][achievementLevel]+"\n";
      }
    }
    var styleElement = document.createElement("style");
    styleElement.type = 'text/css';
    styleElement.innerHTML = styleDictString;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  };

  var buildThreadTree = function(widgetParams, threadTree)
  { var threadCount = countKeys(threadTree);

    var sliceBiteSize = (widgetParams.outerRadius - widgetParams.innerRadius) / 5;
    var threadAngleSize = 360/threadCount;

    var currentAngle = 0;

    var pieBiteData = []

    for (threadName in threadTree)
    { var threadData    = threadTree[threadName];
      var threadItems   = threadData['pieSlices'];
      var itemCount     = countKeys(threadItems);
      var itemAngleSize = threadAngleSize / itemCount;

      if (itemAngleSize < 1.1)
      { alert("There are too many items on this graphic to display well :)");
      }

      threadStyles(styleDict, threadName, threadData['rgb'])

      for (threadItem in threadItems)
      { var innerRadiusDynamic = widgetParams.innerRadius;
        pieSlice = threadItems[threadItem];
        for (pieBiteName in pieSlice)
        { pieBite = pieSlice[pieBiteName]
          pieBite.innerRadius   = innerRadiusDynamic;
          pieBite.outerRadius   = innerRadiusDynamic + sliceBiteSize;
          pieBite.startAngle    = currentAngle;
          pieBite.endAngle      = currentAngle        + itemAngleSize;
          pieBite.threadName    = threadName;
          pieBite.biteClass     = threadName+"_"+pieBite[0];

          var arcD3 = d3.svg.arc()
              .innerRadius(pieBite.innerRadius)
              .outerRadius(pieBite.outerRadius)
              .startAngle(pieBite.startAngle * (pi/180)) //converting from degs to radians
              .endAngle(pieBite.endAngle * (pi/180)); //just radians


          pieBite.arcD3 = arcD3;

          innerRadiusDynamic += sliceBiteSize;
          pieBiteData.push(pieBite);
        }
        currentAngle += itemAngleSize;

      }
    }
    currentAngle += threadAngleSize;
    writeStylesToDocument(styleDict);
    return pieBiteData;
  };
  testThreadTreeData =
  { "Mathematics":
    { rgb:[0,0,100],
      pieSlices:
      { "Ideas of chance and uncertainty":
        [ ["", ""],
          ["secure", "MNU 1-22a - I can use appropriate vocabulary to describe the likelihood of events occurring, using the knowledge and experiences of myself and others to guide me."],
          ["consolidating", "MNU 2-22a - I can conduct simple experiments involving chance and communicate my predictions and findings using the vocabulary of probability."],
          ["developing", "MNU 3-22a - I can find the probability of a simple event happening and explain why the consequences of the event, as well as its probability, should be considered when making choices."],
          ["developing", "MNU 4-22a - By applying my understanding of probability, I can determine how many times I expect an event to occur, and use this information to make predictions, risk assessment, informed choices and decisions."]
        ],
        "Estimation and rounding":
        [ ["secure", "MNU 0-01a - I am developing a sense of size and amount by observing, exploring, using and communicating with others about things in the world around me."],
          ["secure", "MNU 1-01a - I can share ideas with others to develop ways of estimating the answer to a calculation or problem, work out the actual answer, then check my solution by comparing it with the estimate."],
          ["secure", "MNU 2-01a - I can use my knowledge of rounding to routinely estimate the answer to a problem then, after calculating, decide if my answer is reasonable, sharing my solution with others."],
          ["secure", "MNU 3-01a - I can round a number using an appropriate degree of accuracy, having taken into account the context of the problem."],
          ["developing", "MNU 4-01a - Having investigated the practical impact of inaccuracy and error, I can use my knowledge of tolerance when choosing the required degree of accuracy to make real-life calculations."]
        ],
        "Time":
        [ ["secure", "MNU 0-10a - I am aware of how routines and events in my world link with times and seasons, and have explored ways to record and display these using clocks, calendars and other methods."],
          ["consolidating", "MNU 1-10a - I can tell the time using 12 hour clocks, realising there is a link with 24 hour notation, explain how it impacts on my daily routine and ensure that I am organised and ready for events throughout my day."],
          ["consolidating", "MNU 2-10a - I can use and interpret electronic and paper-based timetables and schedules to plan events and activities, and make time calculations as part of my planning."],
          ["consolidating", "MNU 3-10a - Using simple time periods, I can work out how long a journey will take, the speed travelled at or distance covered, using my knowledge of the link between time, speed and distance."],
          ["developing", "MNU 4-10a - I can research, compare and contrast aspects of time and time management as they impact on me."]
        ],
        "Measurement":
        [ ["secure", "MNU 0-11a - I have experimented with everyday items as units of measure to investigate and compare sizes and amounts in my environment, sharing my findings with others."],
          ["secure", "MNU 1-11a - I can estimate how long or heavy an object is, or what amount it holds, using everyday things as a guide, then measure or weigh it using appropriate instruments and units."],
          ["consolidating", "MNU 2-11a - I can use my knowledge of the sizes of familiar objects or places to assist me when making an estimate of measure."],
          ["consolidating", "MNU 3-11a - I can solve practical problems by applying my knowledge of measure, choosing the appropriate units and degree of accuracy for the task and using a formula to calculate area or volume when required."],
          ["developing", "MNU 4-11a - I can apply my knowledge and understanding of measure to everyday problems and tasks and appreciate the practical importance of accuracy when making calculations."]
        ],
        "Mathematics and its impact on the world, past, present and future":
        [ ["", ""],
          ["consolidating", "MTH 1-12a - I have discussed the important part that numbers play in the world and explored a variety of systems that have been used by civilisations throughout history to record numbers."],
          ["consolidating", "MTH 2-12a - I have worked with others to explore, and present our findings on, how mathematics impacts on the world and the important part it has played in advances and inventions."],
          ["consolidating", "MTH 3-12a - I have worked with others to research a famous mathematician and the work they are known for, or investigated a mathematical topic, and have prepared and delivered a short presentation."],
          ["developing", "MTH 4-12a - I have discussed the importance of mathematics in the real world, investigated the mathematical skills required for different career paths and delivered, with others, a presentation on how mathematics can be applied in the workplace."]
        ],
        "Patterns and relationships":
        [ ["secure", "MTH 0-13a - I have spotted and explored patterns in my own and the wider environment and can copy and continue these and create my own patterns."],
          ["secure", "MTH 1-13a - I can continue and devise more involved repeating patterns or designs, using a variety of media."],
          ["consolidating", "MTH 2-13a - Having explored more complex number sequences, including well-known named number patterns, I can explain the rule used to generate the sequence, and apply it to extend the pattern."],
          ["consolidating", "MTH 3-13a - Having explored number sequences, I can establish the set of numbers generated by a given rule and determine a rule for a given sequence, expressing it using appropriate notation."],
          ["developing", "MTH 4-13a - Having explored how real-life situations can be modelled by number patterns, I can establish a number sequence to represent a physical or pictorial pattern, determine a general formula to describe the sequence, then use it to make evaluations and solve related problems."]
        ]
      }
    },
    "Languages":
    { rgb:[180,20,189],
      pieSlices:
      { "Reading to appreciate other cultures":
        [ ["", ""],
          ["", ""],
          ["secure", "MLAN 2-09a - I work on my own and with others to read and discuss simple texts in the language I am learning. I can share simple facts about features of life in some of the countries where the language I am learning is spoken."],
          ["consolidating", "MLAN 3-09a - I work on my own and with others to read and explore texts in the language I am learning. I can demonstrate my knowledge about life and culture in some of the countries where the language I am learning is spoken."],
          ["developing", "MLAN 4-09a - I work on my own and with others to read and research texts in the language I am learning. I can demonstrate my understanding of different cultures and my appreciation of different ways of looking at the world in countries where the language I am learning is spoken."]
        ],
        "Organising and using information":
        [ ["secure", "LIT 0-26a - Within real and imaginary situations, I share experiences and feelings, ideas and information in a way that communicates my message."],
          ["secure", "LIT 1-26a - By considering the type of text I am creating, I can select ideas and relevant information, organise these in a logical sequence and use words which will be interesting and/or useful for others."],
          ["secure", "LIT 2-26a - By considering the type of text I am creating, I can select ideas and relevant information, organise these in an appropriate way for my purpose and use suitable vocabulary for my audience."],
          ["secure", "LIT 3-26a - By considering the type of text I am creating, I can independently select ideas and relevant information for different purposes, and organise essential information or ideas and any supporting detail in a logical order. I can use suitable vocabulary to communicate effectively with my audience."],
          ["consolidating", "LIT 4-26a - By considering the type of text I am creating, I can independently select ideas and relevant information for different purposes, and organise essential information or ideas and any supporting detail in a logical order. I can use suitable vocabulary to communicate effectively with my audience."]
        ],
        "Listening and talking with others":
        [ ["secure", "LGL 0-02a - I have explored and experimented with the patterns and sounds of the language and can use what I have learned."],
          ["secure", "LGL 1-02a - I can respond verbally and non-verbally to a range of requests from teachers and others."],
          ["secure", "LGL 2-02a - I can listen and respond to familiar voices in short, predictable conversations using straightforward language and/or non-verbal techniques such as gesture and eye contact."],
          ["secure", "LGL 3-02a - I can listen and respond to others in mainly predictable, more extended conversations using familiar language and/or non-verbal techniques."],
          ["developing", "LGL 4-02a - I can listen and respond to others, including sympathetic fluent speakers of the language, in extended conversations that are less predictable."]
        ]
      }
    },
    "Sciences":
    { rgb:[0,100, 0],
      pieSlices:
      { "Biodiversity and interdependence":
        [ ["secure", "SCN 0-01a - I have observed living things in the environment over time and am becoming aware of how they depend on each other."],
          ["secure", "SCN 1-01a - I can distinguish between living and non living things. I can sort living things into groups and explain my decisions."],
          ["secure", "SCN 2-01a - I can identify and classify examples of living things, past and present, to help me appreciate their diversity. I can relate physical and behavioural characteristics to their survival or extinction."],
          ["consolidating", "SCN 3-01a - I can sample and identify living things from different habitats to compare their biodiversity and can suggest reasons for their distribution."],
          ["developing", "SCN 4-01a - I understand how animal and plant species depend on each other and how living things are adapted for survival. I can predict the impact of population growth and natural hazards on biodiversity."]
        ],
        "Energy sources and sustainability":
        [ ["secure", "SCN 0-04a - I have experienced, used and described a wide range of toys and common appliances. I can say 'what makes it go' and say what they do when they work."],
          ["secure", "SCN 1-04a - I am aware of different types of energy around me and can show their importance to everyday life and my survival."],
          ["consolidating", "SCN 2-04a - By considering examples where energy is conserved, I can identify the energy source, how it is transferred and ways of reducing wasted energy."],
          ["consolidating", "SCN 3-04a - I can use my knowledge of the different ways in which heat is transferred between hot and cold objects and the thermal conductivity of materials to improve energy efficiency in buildings or other systems."],
          ["developing", "SCN 4-04a - By contributing to an investigation on different ways of meeting society's energy needs, I can express an informed view on the risks and benefits of different energy sources, including those produced from plants."]
        ],
        "Space":
        [ ["secure", "SCN 0-06a - I have experienced the wonder of looking at the vastness of the sky, and can recognise the sun, moon and stars and link them to daily patterns of life."],
          ["secure", "SCN 1-06a - By safely observing and recording the sun and moon at various times, I can describe their patterns of movement and changes over time. I can relate these to the length of a day, a month and a year."],
          ["secure", "SCN 2-06a - By observing or researching features of our solar system, I can use simple models to communicate my understanding of size, scale, time and relative motion within it."],
          ["consolidating", "SCN 3-06a - By using my knowledge of our solar system and the basic needs of living things, I can produce a reasoned argument on the likelihood of life existing elsewhere in the universe."],
          ["developing", "SCN 4-06a - By researching developments used to observe or explore space, I can illustrate how our knowledge of the universe has evolved over time."]
        ],
        "Properties and uses of substances":
        [ ["secure", "SCN 0-15a - Through creative play, I explore different materials and can share my reasoning for selecting materials for different purposes."],
          ["secure", "SCN 1-15a - Through exploring properties and sources of materials, I can choose appropriate materials to solve practical challenges."],
          ["consolidating", "SCN 2-15a - By contributing to investigations into familiar changes in substances to produce other substances, I can describe how their characteristics have changed."],
          ["consolidating", "SCN 3-15a - I have developed my knowledge of the Periodic Table by considering the properties and uses of a variety of elements relative to their positions."],
          ["consolidating", "SCN 4-15a - Through gaining an understanding of the structure of atoms and how they join, I can begin to connect the properties of substances with their possible structures."]
        ]
      }
    }
  };

  pieBiteData = buildThreadTree(
    { "innerRadius": 50,
      "outerRadius": 200
    },
    testThreadTreeData
  );


  function flowNewData(pieBiteData) {


      function extractLabels(data) {

          var k ,d, labels = [];
          for (k in data) {
            d = data[k];

            labels[d.threadName] = true;

          }
          console.log(data);
          console.log(labels);

          var lbs = [];
          for (k in labels) lbs.push(k);
          return lbs;

      }

      var cfg = {
        w: 200,
        h: 200,
        radians: 2 * Math.PI
      };

      var labelData = extractLabels(pieBiteData);
      var labels = vis.selectAll('text.category')
          .data(labelData);
      labels.enter().append('text')
          .classed('category', true)
          .attr("transform", function(d, i, list) {
              var x = 20, y = 40;
              if (d == "Mathematics") { x = 450; y = 130; }
              else if (d == "Languages") { x = 275; y = 530; }
              else if (d == "Sciences") { x = 80; y = 160; }
              return "translate(" + x + "," + y + ")";
          })
          .attr('x', 20)
          .attr('y', 40)
          .text(function(d) { return d; });
      labels.exit().remove();


      pieBitesD3 = vis.selectAll("path")
        .data(pieBiteData);
      pieBitesD3.enter().append("path")
        .attr("transform", "translate(300, 300)")
        .style("stroke", "white")
        .on('click', function(d) {

            if (d3.event.ctrlKey) {

                var k;
                for (k in testThreadTreeData) {
                }
                delete testThreadTreeData[k];

                var data = buildThreadTree(
                    { "innerRadius": 50,
                      "outerRadius": 200
                    },
                    testThreadTreeData
                );

                flowNewData(data);
                return;
            }

            function rRGB() {
                return Math.floor(Math.random() * 256);
            }

            function randomRGB() {
                return [rRGB(), rRGB(), rRGB()];
            }

            function randomScores() {
               var r = Math.random();
               var count = 5;
               var scores = [];
               var score = 3;

               while (count-- > 0) {
                   if (Math.random() < 0.2 && score > 0) {
                       score--;
                   }
                   scores.push([score, "Random Tooltip for this thing"]);
               }

               return _.map(scores, function(score) {
                   if (score[0] == 3) {
                       score[0] = 'secure';
                   } else if (score[0] == 2) {
                       score[0] = 'consolidating';
                   } else {
                       score[0] = 'developing';
                   }
                   return score;
               });
            }

            function randomSlices() {
                var count = Math.ceil(Math.random() * 6);
                var slices = {};
                while (count-- > 0) {
                    var sliceName = 'Slice_' + Math.ceil(Math.random() * 1000);
                    slices[sliceName] = randomScores();
                }
                return slices;
            }

            var s = 'Subject_' + Math.floor(Math.random() * 1000);
            testThreadTreeData[s] = {
                rgb: randomRGB(),
                pieSlices: randomSlices()
            };

            var data = buildThreadTree(
                { "innerRadius": 50,
                  "outerRadius": 200
                },
                testThreadTreeData
            );

            flowNewData(data);
        });

      var arcs = pieBitesD3
        .attr("class", function(d){ return d.biteClass})
        .attr("d", function(d) {return d.arcD3(); })

      arcs.append('svg:title').text(function(d) { return d[1]; });

      pieBitesD3.exit().remove();
  }

  flowNewData(pieBiteData);

  /*
  var arcEarly = d3.svg.arc()
      .innerRadius(50)
      .outerRadius(80)
      .startAngle(0 * (pi/180)) //converting from degs to radians
      .endAngle(5 * (pi/180)); //just radians
  vis.append("path")
      .attr("d", arcEarlyw
      .attr("transform", "translate(200,200)")
      .attr("class", "developing")
      .style("stroke", "white")
  .append("svg:title").text("I can collect objects and ask questions to gather information, organising and displaying my findings in different ways.");
    */

};

window.onload = ljdj.init;
