// RE USABLE SEARCH FUNCTION

export function getSearchValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }
  
  export function getSelectValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }