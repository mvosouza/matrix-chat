import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_BASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const listeningMessagesInRealTime = (addMessage) => {
  supabaseClient
    .from("messages")
    .on("INSERT", ({ new: newMessage }) => {
      addMessage(newMessage);
    })
    .subscribe();
};

export default function ChatPage() {
  const [message, setMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState([]);
  const router = useRouter();

  const { username } = router.query;

  React.useEffect(() => {
    const getMessagesFromSupabase = async () => {
      const response = await supabaseClient
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessageList(response.data);
    };

    getMessagesFromSupabase();
    listeningMessagesInRealTime((newMessage) => {
      setMessageList((actualMessageList) => [newMessage, ...actualMessageList]);
    });
  }, []);

  const handleNewMessage = async (newMessage) => {
    await supabaseClient.from("messages").insert([
      {
        from: username,
        text: newMessage,
      },
    ]);
    setMessage("");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleMessageKey = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      await handleNewMessage(message);
    }
  };

  const handleMessageDelete = async (e) => {
    const messageId = e.currentTarget.id;
    await supabaseClient.from("messages").delete().match({ id: messageId });
    setMessageList([...messageList.filter(({ id }) => id !== messageId)]);
  };

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(${appConfig.background.matrix})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            messages={messageList}
            onDeleteMessage={handleMessageDelete}
          />
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleMessageKey}
            />
            <ButtonSendSticker
              onStickerClick={async (sticker) => {
                await handleNewMessage(`:sticker: ${sticker}`);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({ messages, onDeleteMessage }) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {messages.map(({ id, from, text, created_at }) => (
        <Text
          key={id}
          tag="li"
          styleSheet={{
            borderRadius: "5px",
            padding: "6px",
            marginBottom: "12px",
            hover: {
              backgroundColor: appConfig.theme.colors.neutrals[700],
            },
          }}
        >
          <Box
            styleSheet={{
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${from}.png`}
              />
              <Text tag="strong">{from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date(created_at).toLocaleDateString()}
              </Text>
            </Box>
            <Button
              id={id}
              colorVariant="negative"
              label="x"
              size="xs"
              variant="tertiary"
              styleSheet={{
                width: "6px",
                height: "6px",
                padding: "6px",
                borderRadius: "50%",
                color: appConfig.theme.colors.neutrals["000"],
              }}
              onClick={onDeleteMessage}
            />
          </Box>
          {text.startsWith(":sticker:") ? (
            <Image
              src={text.replace(":sticker:", "")}
              styleSheet={{ height: "7em" }}
            />
          ) : (
            text
          )}
        </Text>
      ))}
    </Box>
  );
}
