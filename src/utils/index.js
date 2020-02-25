export const imageUrl = image => {
  return `https://image.tmdb.org/t/p/w500${image}`;
};

export const siteList = {
  youtube: 'YOUTUBE',
  vimeo: 'VIMEO'
};

export const videoUrl = video => {
  let url = '';
  const { site, key } = video;
  if (site.toUpperCase() === siteList.youtube) {
    url = `https://www.youtube.com/watch?v=${key}`;
  } else if (site.toUpperCase() === siteList.vimeo) {
    url = `https://vimeo.com/${key}`;
  }
  return url;
};
