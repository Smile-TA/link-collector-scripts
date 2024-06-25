import axios from "axios";

const baseUrl = process.argv[2];
const postType = process.argv[3] ?? "pages";

async function getPageLinks() {
  const res = await axios.get(`${baseUrl}/wp-json/wp/v2/${postType}`);
  // console.log(res.headers);
  const wpTotal = res.headers["x-wp-total"] ?? "PAGE TOTAL IS UNKNOWN";
  const wpTotalPages =
    res.headers["x-wp-totalpages"] ?? "PAGE TOTAL IS UNKNOWN";
  console.log(`Total pages: ${wpTotal}`);
  const promises = [];
  for (let i = 1; i <= wpTotalPages; i++) {
    promises.push(axios.get(`${baseUrl}wp-json/wp/v2/${postType}?page=${i}`));
  }
  const pages = await Promise.all(promises);
  const links = pages
    .map((p) => p.data)
    .reduce((acc, p) => {
      return [...acc, ...p.map((link) => link.link)];
    }, []);
  links.forEach((link) => console.log(link));
  console.log(JSON.stringify(links));
}

getPageLinks();
