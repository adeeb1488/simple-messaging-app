
// searching for users to create new chat instances

export const senderName = (currentUser, user) =>{
return user[0]._id===currentUser._id?user[1].user_name:user[0].user_name
}

export const senderDetails = (currentUser, user) =>{
    return user[0]._id===currentUser._id?user[1]:user[0]
    }

export const isSameSender = (messages, m, i, userId) => {
    //   console.log(userId)
    return (
          i < messages.length - 1 &&
          (messages[i + 1].sentBy._id !== m.sentBy._id ||
            messages[i + 1].sentBy._id === undefined) &&
          messages[i].sentBy._id !== userId
         
        );
      };
export const isLastMessage = (messages, i, userId) => {
        return (
          i === messages.length - 1 &&
          messages[messages.length - 1].sentBy._id !== userId &&
          messages[messages.length - 1].sentBy._id
        );
      };

      export const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sentBy._id === m.sentBy._id &&
          messages[i].sentBy._id !== userId
        )
          return 33;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sentBy._id !== m.sentBy._id &&
            messages[i].sentBy._id !== userId) ||
          (i === messages.length - 1 && messages[i].sentBy._id !== userId)
        )
          return 0;
        else return "auto";
      };

      export const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sentBy._id === m.sentBy._id;    
      };