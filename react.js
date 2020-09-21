/**
 * we will rewrite react from scratch
 * first createElement function
 * second createTextElement function
 * third ReactDom.render function
 */

//like React.createElement
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(element) {
  return {
    type: "TEXT ELEMENT",
    props: {
      nodeValue: element,
      children: [],
    },
  };
}
const element = createElement(
  "div",
  { title: "foo", id: "fooID" },
  createElement(
    "p",
    {
      title: "pfoo",
      onClick: () => {
        console.log("this is p node");
      },
    },
    "this is p"
  ),
  createElement("span", { id: "spanid" }, "this is span")
);
// const temp = {
//   type: "div",
//   props: {
//     title: "foo",
//     id: "fooID",
//     children: [
//       {
//         type: "p",
//         props: {
//           title: "pfoo",
//           onClick: () => {
//             console.log("click p node");
//           },
//           children: [
//             {
//               type: "TEXT ELEMENT",
//               nodeValue: "this is p",
//             },
//           ],
//         },
//       },
//       {
//         type: "span",
//         props: {
//           title: "spanid",
//           children: [
//             {
//               type: "TEXT ELEMENT",
//               nodeValue: "this is pan",
//             },
//           ],
//         },
//       },
//     ],
//   },
// };
//like ReactDom.render
function render(element, rootDom) {
  const { type, props } = element;
  //判断type是否是文本节点
  const dom =
    type === "TEXT ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  //给创建的节点添加事件(onClick|onChange...)
  const isEvent = (name) => name.startsWith("on");
  Object.keys(props)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().slice(2); //"onClick".slice(2)=>click
      dom.addEventListener(eventType, props[name]);
    });
  //给创建的节点添加属性 (id,title...)
  const isAttribute = (name) => !isEvent(name) && name != "children";
  Object.keys(props)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = props[name];
    });

  //递归子节点
  const childElements = props.children || [];
  childElements.forEach((childElement) => render(childElement, dom));
  rootDom.append(dom);
}

render(element, document.getElementById("app"));
