const chats = [
    {
      isGroupChat: false,
      users: [
        {
          name: "abc",
          email: "abc@example.com",
        },
        {
          name: "Def",
          email: "Def@example.com",
        },
      ],
      _id: "617a077e18c25468bc7c4dd4",
      chatName: "Abc",
    },
    {
      isGroupChat: false,
      users: [
        {
          name: "Guest",
          email: "guest@example.com",
        },
        {
          name: "Uvw",
          email: "Uvw@example.com",
        },
      ],
      _id: "617a077e18c25468b27c4dd4",
      chatName: "Guest",
    },
    {
      isGroupChat: false,
      users: [
        {
          name: "Xyz",
          email: "Xyz@example.com",
        },
        {
          name: "Hello",
          email: "Hello@example.com",
        },
      ],
      _id: "617a077e18c2d468bc7c4dd4",
      chatName: "Xyz",
    },


    {
      isGroupChat: true,
      users: [
        {
          name: "John Doe",
          email: "jon@example.com",
        },
        {
          name: "ABC",
          email: "abc@example.com",
        },
        {
          name: "Def",
          email: "Def@example.com",
        },
      ],
      _id: "617a518c4081150016472c78",
      chatName: "Group 1",
      groupAdmin: {
        name: "Def",
        email: "Def@example.com",
      },
    },
  ];

export default chats;