# Grouping

**A library to streamline getting flat arrays to be displayed in a UI list view with sections and rows.**

Frquently an array of data will need to be displayed in a UI list 
view with section and an index list. A lot of time the array will be transformed
into a multi-dimensional array to get section titles, rows per section and index list.
This has a lot of large allocations when resorting and search/filtering a list. 

## Basic usage

`var group = new Group(data, ['type']);
var secondSectionFirstItem = group.item([1,0];`

## Methods

* count
* title
* item


## Sample Dataset

`var data = [
    {type:10, date:new Date('2015/1/1')},
    {type:10, date:new Date('2015/1/1')},
    {type:10, date:new Date('2015/1/4')},
    {type:40, date:new Date('2015/1/1')},
    {type:20, date:new Date('2015/1/1')},
    {type:60, date:new Date('2015/1/1')},
    {type:10, date:new Date('2015/1/3')},
    {type:20, date:new Date('2015/1/3')},
    {type:30, date:new Date('2015/1/3')},
    {type:20, date:new Date('2015/1/3')},
];`

## Common usage

* Sort and group on the type property

`var group = new Group(data, ['type']);`

* get a count of all the groups

`var groupCount = group.coun();`

* get the title of the second group

`var title = group.title([1]);`

* get the item in the fifth group, first row

`var item = group.item([4,0]);`



## Multiple levels of grouping/sorting

* any number of properties can be sorted and grouped on. 

`var group =  new Group(data, ['type', 'date']; //note: see custom sorting`

## Custom sorting

* optionally pass in custom sorting methods.
In the example below, date requires a custom sorter.


`var group = new Group(data, {
    date: function(a,b) {
        return a.getDate() - b.getDate();
    },
    type: function(a,b){
        return (a > b ? 1 : (a < b ? -1 : 0));
    }
});`

* get the item in the first group, first subgroup, second row

`var item = group.items([0,0,1]);`


See further examples in the index.html file.

