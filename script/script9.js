/**
 * Created by tangdru on 12/13/15.
 */
var margin = {t:50,r:50,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var plot2 = d3.select('#plot-2')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Import
queue()
    .defer(d3.csv,'data/nobelPrizes_cleaned.csv',parseCountry)
    .defer(d3.csv,'data/countryMetadata.csv',parseCountryMetadata)
    .defer(d3.csv,'data/yearMetadata.csv',parseYearMetadata)
    .await(dataLoaded);


//Generator
var lineGenerator = d3.svg.line()
    .x(function(d){ return scaleX(d.yr)})
    .y(function(d){ return scaleY(d.mdlcnt*2)})//scaleY(total value of year from country
    //.y(function(d){return scaleY(function(d)return d.yr;})
    // .rollup d3.sum(d, function(g){return g.values;});
    .interpolate('basis');



//Scales
var scaleX = d3.scale.linear().domain([1900,2015]).range([0,width*.6]),
    scaleY = d3.scale.linear().domain([0,100]).range([height,0]);


function dataLoaded(err,dataset,countryMetadata,yearMetadata) {
    console.log(dataset);

    var nestedData = d3.nest()
        .key(function (d) {
            return d.ctry
        })
        .key(function (d) {
            return d.yr
        })
        .rollup(function (leaves) {
            return {
                prizes: leaves,
                total: leaves.length
            }
        })
        .entries(dataset);
    console.log(nestedData);



    //create and populate "zero" array set
    /*var zerosArray =[];
    for (i=0; i<115; i++){
        zerosArray.push({year:1901+i, prizeName:0});
    }
    console.log(zerosArray);*/

    //create 57 arrays of 115 years of zeros arrays
    var emptyArray = [];
    for (j=0; j<57; j++){
        var zerosArray =[];
        for (i=0; i<115; i++){
            zerosArray.push({yr:1901+i, prizeName:0, name:0, ctry:0});
        }
        emptyArray.push(zerosArray);
    }
    //console.log(emptyArray);

    countryMap = d3.map();
    for (i = 0; i < countryMetadata.length; i++) {
        countryMap.set(countryMetadata[i].ctry, countryMetadata[i].index);
    }
    //console.log(countryMap);

    yearMap = d3.map();
    for (i = 0; i < yearMetadata.length; i++) {
        yearMap.set(yearMetadata[i].year, yearMetadata[i].index);
    }
    //console.log(yearMap);

    //console.log(country[0]);
    //Object {yr: 1970, ctry: "Argentina", prizeName: "Chemistry", name: "Luis Leloir"}
    //console.log(countryMetadata.get("Argentina"));


    for(i = 0; i < dataset.length; i++) {
        //if(!uniqueCountryYear[dataset[i].contains(dataset[i].year)) {
        uniqueCountryYear.push({ctry: dataset[i].ctry, year: dataset[i].yr});
        //}
    }

    uniqueCountryYear = [];
    // iterate country
    for (i = 0; i < dataset.length; i++) {
        countryIndex = countryMap.get(dataset[i].ctry);
        yearIndex = yearMap.get(dataset[i].yr);
        if(!uniqueCountryYear[i].contains(dataset[])
            // yearMetadata[i].year
            //nestedData[d].
        }
    }
        // iterate through each year
            // if not add empty data

    // copy zero array
    dirtyArray = emptyArray;

    for (i=0; i < dataset.length; i++) {

        countryIndex = countryMap.get(dataset[i].ctry);
        //console.log(countryIndex);
        yearIndex = yearMap.get(dataset[i].yr);
        //console.log(yearIndex);
        //console.log((fulldataset[countryIndex])[yearIndex]);
        (dirtyArray[countryIndex])[yearIndex].ctry = dataset[i].ctry;
        (dirtyArray[countryIndex])[yearIndex].name = dataset[i].name;
        (dirtyArray[countryIndex])[yearIndex].prizeName = dataset[i].prizeName;
        (dirtyArray[countryIndex])[yearIndex].yr = dataset[i].yr;
    }

    console.log(dirtyArray);

    var fullArray = d3.nest()
        .key(function (d) {
            return d.ctry
        })
        .key(function (d) {
            return d.yr
        })
        .rollup(function (leaves) {
            return {
                prizes: leaves,
                total: leaves.length
            }
        })
        .entries(dirtyArray);

    console.log(fullArray);

    var countryLines = plot.selectAll('country-groups')
        .data(emptyArray)
        .enter()
        .append('g')
        .attr('class','country-groups')
        .attr('transform', function(d,i){
            return 'translate('+10*i+ ',' +10*i+ ')'});

    countryLines
        .append('path')
        .attr('class','data-line');

    var eachLine = plot.selectAll('.data-line')
        .data(emptyArray)
        .attr('d', function(d,i){
            return lineGenerator(emptyArray[i])})
        .style('stroke','gray');



}





function parseCountry(d){return {
        yr:+d['year']!='..'?+d['year']:undefined,
        ctry: d['country']!='..'?d['country']:undefined,
        prizeName: d['prize']!='..'?d['prize']:undefined,
        name:d['name']!='..'?d['name']:undefined
    }
}

function parseCountryMetadata(d){
    return {
        ctry: d.country,
        index: d.index
    }
}


function parseYearMetadata(d){
    return {
        year: d.year,
        index: d.index
    }
}
