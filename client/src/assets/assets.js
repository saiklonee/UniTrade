import logo from "./logo.svg";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.png";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import bottom_banner_image from "./bottom_banner_image.png";
import bottom_banner_image_sm from "./bottom_banner_image_sm.png";
import add_address_iamge from "./add_address_image.svg";
import laptop_image from "./laptop.png";
import headphone_image from "./headphone.png";
import cpu_image from "./cpu.png";
import smartwatch_image from "./smartwatch.png";
import gamingchair_image from "./gamingchair.png";
import keyboard_image from "./keyboard.png";
import home_banner from "./graduation.jpeg";
import home_banner_two from "./homebannertwo.jpg";

export const assets = {
  logo,
  home_banner,
  home_banner_two,
  headphone_image,
  smartwatch_image,
  gamingchair_image,
  keyboard_image,
  cpu_image,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
  laptop_image,
};

export const categories = [
  {
    text: "Laptops & Computers",
    path: "laptops-computers",
    image: laptop_image,
    bgColor: "#E0F4FF",
  },
  {
    text: "PC Components",
    path: "pc-components",
    image: cpu_image, // Use a CPU/motherboard image
    bgColor: "#EDE7F6", // Light purple
  },

  {
    text: "Headphones",
    path: "audio",
    image: headphone_image,
    bgColor: "#E0FFE8",
  },
  {
    text: "Gaming Gear",
    path: "gaming",
    image: gamingchair_image,
    bgColor: "#FFF3E0",
  },

  {
    text: "Wearable Tech",
    path: "wearables",
    image: smartwatch_image,
    bgColor: "#FFE0E9",
  },
  {
    text: "PC Accessories",
    path: "accessories",
    image: keyboard_image,
    bgColor: "#E0F7FA",
  },
];
export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fastest Delivery",
    description: "Groceries delivered in under 30 minutes.",
  },
  {
    icon: leaf_icon,
    title: "Freshness Guaranteed",
    description: "Fresh produce straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "Quality groceries at unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];
