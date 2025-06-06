import { ActionPanel, Form, Action } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [japaneseSentence, setJapaneseSentence] = useState<string>("");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Generate Audio"
            onSubmit={(values) => {
              console.log("Japanese sentence:", values.japaneseSentence);
              // Add your audio generation logic here
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="japaneseSentence"
        title="Enter Japanese Sentence"
        placeholder="こんにちは、元気ですか？"
        value={japaneseSentence}
        onChange={setJapaneseSentence}
        info="Enter a Japanese sentence to generate speech audio"
      />
    </Form>
  );
}
