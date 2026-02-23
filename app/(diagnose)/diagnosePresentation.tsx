import Diagnose_presentation from "@/components/diagnose_presentation";
import { useLocalSearchParams } from "expo-router";

const DiagnosePresentation = () => {
  const { imageUri, response } = useLocalSearchParams(); 
  const parsedResponse = JSON.parse(response); 
   
  
  return <Diagnose_presentation imageUri={imageUri} data={parsedResponse} />;
};

export default DiagnosePresentation;