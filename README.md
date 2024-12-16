# Artworks Pagination with Row Selection

This project implements a paginated data table with selectable rows using the [PrimeReact](https://www.primefaces.org/primereact/) library. The data is fetched from the Art Institute of Chicago API and displayed in a user-friendly table interface.

## Features

- **Pagination**: Users can navigate through pages of artwork data.
- **Row Selection**: Users can select multiple rows and keep the selection persistent across page navigation.
- **Dynamic Updates**: Updates the `sortNum` state depending on the row selection made to the table.
- **Custom Input**: Allows user input to preselect the number of rows using an overlay panel.
- **Loader**: Renders a loading spinner for when the data is fetching.
### Technologies Used
### Technologies Used
* Front-end: React
* PrimeReact: UI component table, paginator, input
* Axios: API calls
* TypeScript: Added type safety
* CSS: Used to style components