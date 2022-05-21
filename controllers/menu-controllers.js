const Menu = require("../Models/Menu");
const { v4: uuidv4 } = require("uuid");
const { Translate } = require("@google-cloud/translate").v2;

const getMenu = async (req, res) => {
  console.log("hello g");
  let menu;
  try {
    menu = await Menu.find({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching menu",
    });
    return;
  }
  res.json({ menu, success: true });
};

const addMenu = async (req, res) => {
  console.log(req.body);
  let { title, description } = req.body;

  const createdMenu = new Menu({
    title,
    description,
  });
  try {
    createdMenu.save((err) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          data: err,
          message: "Creating Menu Failed",
        });
        return;
      } else {
        res.json({ success: true, message: "Menu Created" });
        return;
      }
    });
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Creating Menu Failed",
    });
    return;
  }
};

const addSection = async (req, res) => {
  console.log(req.body);
  let { title, description, menuId } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  console.log(menu);
  if (menu) {
    let sections = menu.sections;
    let updatedSections = [
      ...sections,
      { title, description, id: uuidv4(), items: [] },
    ];
    console.log(updatedSections);

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Section Added",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const editSection = async (req, res) => {
  console.log(req.body);
  let { title, description, menuId, sectionId } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  // console.log(menu);
  if (menu) {
    let sections = menu.sections;
    let foundSection = sections.find((section) => section.id === sectionId);
    foundSection = { ...foundSection, title, description };

    console.log(foundSection, "Updated Section");

    let updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return foundSection;
      }
      return section;
    });

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Section Updated",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const deleteSection = async (req, res) => {
  // console.log(req.body);
  let { menuId, sectionId } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  // console.log(menu);
  if (menu) {
    let sections = menu.sections;
    // let foundSection = sections.find((section) => section.id === sectionId);
    // // console.log(foundSection);

    let updatedSections = sections.filter(
      (section) => section.id !== sectionId
    );

    console.log(updatedSections);

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Section Deleted",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const addItem = async (req, res) => {
  // console.log(req.body);
  let {
    itemName,
    description,
    menuId,
    sectionId,
    images,
    price,
    ingredients,
    hotSelling,
  } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  // console.log(menu);
  if (menu) {
    let sections = menu.sections;
    let foundSection = sections.find((section) => section.id === sectionId);
    // console.log(foundSection);

    let addedItem = {
      ...foundSection,
      items: [
        ...foundSection.items,
        {
          itemName,
          description,
          images,
          price,
          ingredients,
          hotSelling,
          id: uuidv4(),
        },
      ],
    };
    // console.log(addedItem);

    let updatedSections = sections.map((section) => {
      if (section.id === addedItem.id) {
        return addedItem;
      }
      return section;
    });

    console.log(updatedSections, "These are updated Sections");

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Item Added",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const editItem = async (req, res) => {
  // console.log(req.body);
  let {
    itemName,
    description,
    menuId,
    sectionId,
    images,
    price,
    ingredients,
    hotSelling,
    itemId,
  } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  // console.log(menu);
  if (menu) {
    let sections = menu.sections;
    let foundSection = sections.find((section) => section.id === sectionId);
    // console.log(foundSection);

    let updatedItems = foundSection.items.map((item) => {
      if (item.id === itemId) {
        return {
          itemName,
          description,
          images,
          price,
          ingredients,
          hotSelling,
        };
      }
      return item;
    });

    foundSection.items = updatedItems;
    console.log(foundSection, "FoundSection item updated");

    // let addedItem = {
    //   ...foundSection,
    //   items: [
    //     ...foundSection.items,
    //     {
    //       itemName,
    //       description,
    //       images,
    //       price,
    //       ingredients,
    //       hotSelling,
    //       id: uuidv4(),
    //     },
    //   ],
    // };
    // console.log(addedItem);

    let updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return foundSection;
      }
      return section;
    });

    console.log(updatedSections, "These are updated Sections");

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Item Updated",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const deleteItem = async (req, res) => {
  // console.log(req.body);
  let { itemId, menuId, sectionId } = req.body;

  let menu = await Menu.findOne({ _id: menuId });
  // console.log(menu);
  if (menu) {
    let sections = menu.sections;
    let foundSection = sections.find((section) => section.id === sectionId);
    // console.log(foundSection);

    let itemsUpdated = foundSection.items.filter((item) => item.id !== itemId);
    console.log(itemsUpdated.length);

    foundSection = {
      ...foundSection,
      items: [...itemsUpdated],
    };

    // console.log(foundSection);

    let updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return foundSection;
      }
      return section;
    });

    console.log(updatedSections);

    try {
      await Menu.updateOne(
        { _id: menuId },

        {
          $set: {
            sections: updatedSections,
          },
        },
        function (err) {
          console.log(err);
          if (err) {
            res.json({
              success: false,
              message: "Something went wrong",
            });
            return;
          } else {
            res.json({
              success: true,
              message: "Item Deleted",
            });
            return;
          }
        }
      ).clone();

      console.log("done");
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  }
};

const projectId = "easy-dine-347018";
const translate = new Translate({
  projectId: "easy-dine-347018", //eg my-project-0o0o0o0o'
  keyFilename: "easy-dine-347018-466ab2db8a63.json", //eg my-project-0fwewexyz.json
});

async function quickStart(itemData, langCode) {
  // The text to translate
  // const text = "i love you!";
  let text = {};

  // The target language
  const target = langCode;

  // Translates some text into Russian

  await Promise.all(
    Object.values(itemData).map(async (item, i) => {
      // console.log(item, i);
      const [translations] = await translate.translate(item, target);
      // console.log(translations, i);
      // text[i] = translations;
      if (i === 0) {
        console.log("hello 0000000");
        text = { ...text, itemName: translations };
        console.log(text);
      } else if (i === 1) {
        text = { ...text, description: translations };
        console.log(text);
      } else if (i === 2) {
        text = { ...text, ingredients: translations };
        console.log(text);
      }
    })
  );
  console.log(text);

  return text;

  // for (const [key, value] of Object.entries(text)) {
  //   // console.log(`${key}: ${value}`);
  //   console.log(key);
  //   if (key === "0") {
  //     console.log("hello 0000000");
  //     translatedText = { ...translatedText, itemName: value };
  //     console.log(translatedText);
  //   } else if (key === "1") {
  //     translatedText = { ...translatedText, description: value };
  //     console.log(translatedText);
  //   } else if (key === "2") {
  //     translatedText = { ...translatedText, ingredients: value };
  //     console.log(translatedText);
  //   }
  // }

  // return translatedText;

  // console.log(`Text: ${text}`);
  // console.log(`Translation: ${translation}`);
}

const translateMenuItem = async (req, res) => {
  console.log(req.body);
  const { itemName, description, ingredients, langCode } = req.body;
  let translatedText = quickStart(
    { itemName, description, ingredients },
    langCode
  );
  // console.log(translatedText, "yoooooooooooooooo");
  translatedText.then((val) => {
    console.log(val, "yooooooooooooooo");
    res.json({
      success: true,
      translatedData: val,
    });
  });
};

module.exports = {
  getMenu,
  addMenu,
  addSection,
  editSection,
  deleteSection,
  addItem,
  deleteItem,
  editItem,
  translateMenuItem,
};
