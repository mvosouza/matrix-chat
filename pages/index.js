import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import { useState } from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";

function Title({ children, tag }) {
  // creating a JSX Tag based on a prop
  const Tag = tag ?? "h1";
  return (
    <>
      <Tag>{children}</Tag>
      {/* <style jsx>{`
        ${Tag} {
          color: appConfig.theme.colors.neutrals[000];
        }
      `}</style> */}
    </>
  );
}

function HomePage() {
  const [username, setUsername] = useState("");
  const [githubUser, setGithubUser] = useState(null);
  const router = useRouter();

  const getGithubUserJsonByUsername = async (githubUsername) => {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}`
    );

    if (response.status == 200) {
      return await response.json();
    } else {
      return null;
    }
  };

  const handlerUsernameChange = async (e) => {
    const value = e.target.value;
    setUsername(value);
    setGithubUser(await getGithubUserJsonByUsername(value));
  };

  const formSubmiter = (e) => {
    e.preventDefault();
    // changing the route with javascript api
    // window.location.href = "/chat";
    // Nextjs route hook
    router.push("/chat");
  };

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[800],
          backgroundImage:
            "url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={formSubmiter}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
              value={username}
              onChange={handlerUsernameChange}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              disabled={username?.length < 1}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            {githubUser && (
              <>
                <Image
                  styleSheet={{
                    borderRadius: "50%",
                    marginBottom: "16px",
                  }}
                  src={`https://github.com/${username}.png`}
                />
                <Text
                  variant="body4"
                  styleSheet={{
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: "3px 10px",
                    borderRadius: "1000px",
                  }}
                >
                  {githubUser.name}
                </Text>
              </>
            )}
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}

export default HomePage;
