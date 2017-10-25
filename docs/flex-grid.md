#Flex Grid

The grid is a custom build using [flex box](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and mixes some of the concepts used in the [Foundation](http://foundation.zurb.com/sites/docs/grid.html) and [Bootstrap](https://v4-alpha.getbootstrap.com/layout/grid/) frameworks. In general the Foundation syntax is used, with some extra flexbox modifier classes. Take a look at `resources/sass/objects/_flex-grid.scss` for the main grid setup and the general flexbox utility classes here `resources/sass/utilities/_display.scss`

##Usage

Start by adding an element with a class of `.row`. This will create a horizontal block to contain vertical columns. Then add elements with a `.column` class within that row. Specify the widths of each column with the `.small-#`, `.medium-#`, and `.large-#` classes. The number on a column defines how many column widths across it takes up, so `.large-6` means on a large screen in will take up 6 columns out of 12 so 50% of the row width. By default a `.column` without any width classes	 with be 100% width.

The layout is mobile-first. Code for small screens first, and larger devices will inherit those styles. Customize for larger screens as necessary.

The grid is based on a twelve column layout. Rows  use the `flex-wrap` property of flex box so it's possible to have more than twelve columns in a row. Any columns which exceed a twelve column width will wrap onto the following line. 

Rows are always 100% width of the parent container. To restrict the width, it's recommended to apply styles to the parent container.

If necessary it's possible to nest grids within each other.

The below would create three columns, which would each display 100% width on small and medium devices, but 33% width on large devices and larger.

```html
<div class="row">
	<div class="column large-4"></div>
	<div class="column large-4"></div>
	<div class="column large-4"></div>
</div>
```

##Collapse

If gutters aren't required between the columns, then add the `.collapse` class to the row element. This will remove all horizontal padding from both the row and the columns. It's possible to collapse and uncollapse at different sizes. The below would create a grid with no gutters on small and medium devices, but with gutters on large devices and larger.

```html
<div class="row collapse large-uncollapse">
	<div class="column large-4"></div>
	<div class="column large-4"></div>
	<div class="column large-4"></div>
</div>
```

##Offset

Columns run from left to right. If an offset is necessary to push content further from the left hand side, the offset classes can be used, these are used in tandem with sizes: `.small-offset-#`, `.medium-offset-#`, etc. The below will push the content along two column widths on small devices, one column width on medium devices, and reset to the start on large devices.

```html
<div class="row small-offset-2 medium-offset-1 large-offset-0">
	<div class="column small-4 medium-5 large-6"></div>
	<div class="column small-4 medium-5 large-6"></div>
</div>
```

##Ordering

Using the flexbox ordering property it is simple to reorder columns, which can be useful when used in tandem with sizing. The ordering classes are: `.small-order-#`, `.medium-order-#`, etc. The below will reverse the order of columns on medium devices and reset to source order for large devices.

```html
<div class="row">
	<div class="column medium-4 medium-order-3 large-order-default"></div>
	<div class="column medium-4"></div>
	<div class="column medium-4 medium-order-1 large-order-default"></div>
</div>
```

##General flexbox modifiers

### Grow and Shrink
There are some additional classes that can be used to modify the behaviour of the grid layout. By default columns have flex property `flex: 0 0 auto`, which means they will neither expand to fill remaining space, or shrink to fit. Adding `.-grow-1` to a column, will set `flex-grow: 1` so this column will expand to fill any remaining horizontal space in the row. Adding `.-shrink-1` to a column, will set `flex-shrink: 1`, this can be used to fit more than 12 columns into a row, but be careful with how it interacts with `flex-wrap: wrap`.

### Justify and Align
The default flex setup for a row is:

```
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: flex-start;
align-items: stretch;
align-content: flex-start;
```

To change the justify and align properties you can use the relevant modifier classes on the row element:

* `.-justify-content-center`
* `.-justify-content-space-around`
* `.-justify-content-space-between`
* `.-justify-content-end`
* `.-align-items-start`
* `.-align-items-center`
* `.-align-items-end`
* `.-align-items-stretch`

There are also breakpoint variations if necessary: `.-small-justify-content-center`, `.-medium-justify-content-center`, etc.