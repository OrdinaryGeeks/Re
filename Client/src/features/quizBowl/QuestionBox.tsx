import { Card, Typography, Box, Button } from "@mui/material";

import { MouseEventHandler } from "react";
import { useAppSelector } from "../../app/Store/configureStore";

export default function QuestionBox(props: {
  onClick: MouseEventHandler;

  questionIndex: number;
}) {
  const { questions } = useAppSelector((store) => store.quiz);
  // const [loading, setLoading] = useState(true);
  //const [questions, setQuestions] = useState<Question[]>([]);

  //const questionSeconds = 0;
  //const seconds = 0;

  return (
    <Box mb="30px" p="20px" display="flex">
      {
        <Card>
          <Typography className="generalHeading" mb="10px" variant="h6">
            Current Question{" "}
            {questions[props.questionIndex % questions.length].points}
          </Typography>
          <Typography className="generalHeading2" mb="10px" variant="h6">
            {questions[props.questionIndex % questions.length].text}
          </Typography>
          <Box className="buttonBox">
            <Button variant="contained" type="button" onClick={props.onClick}>
              Next Question
            </Button>
          </Box>
        </Card>
      }
    </Box>
  );
}
