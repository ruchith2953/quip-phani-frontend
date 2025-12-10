 export const formatComponentName = (name = "") => {
  const firstPart = name.split("|")[0]; 
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
};

