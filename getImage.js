import axios from "axios";

const getImage = async () => {
  console.log("Using this image generator: " + process.env.IMAGE_GENERATOR);
  const { data } = await axios.get(process.env.IMAGE_GENERATOR);
  return data;
};

export default getImage;
