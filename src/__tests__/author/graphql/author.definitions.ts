export const CREATE_AUTHOR = `
  mutation createAuthor {
    createAuthor(
      name: "Mark Twain"
      birth: "1903-06-25T00:00:00.000Z"
      categories: [FICTION]
    ) {
      id
      name
      birth
      categories
    }
  }
`;

export const UPDATE_AUTHOR = (id: number, name: string): string => `
  mutation updateAuthor {
    updateAuthor(
      id: ${id}
      name: "${name}"
    ) {
      name
    }
  }
`;

export const GET_ONE_AUTHOR = (id: number): string => `
  query getAuthorById{
    getAuthorById(id:${id}){
      name
    }
  }
`;

export const GET_ALL_AUTHORS = `
    query getAllAuthors {
        getAllAuthors {
        id
        name
        birth
        categories
        }
    }
`;

export const DELETE_AUTHOR = (id: number): string => `
  mutation deleteAuthor {
    deleteAuthor(id: ${id})
  }
`;
