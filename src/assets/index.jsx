const images = import.meta.glob('../assets/Banner*.*', { eager: true });

const imageList = Object.values(images).map((module) => module.default);

export default imageList;
