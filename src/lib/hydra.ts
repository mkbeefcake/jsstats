import { hydraLocation } from "../config";
import axios from "axios";

export const fetchPending = async (offset: number = 0) => {
  const query = `query {\n  dataObjects(where: {liaisonJudgement_eq: PENDING}, offset: ${offset}, limit: 1000) { \n    id,\n    createdAt,\n    updatedAt,\n    createdInBlock,\n    typeId,\n    size,\n    liaison {\n      id,\n      createdAt,\n      updatedAt,\n      isActive,\n      workerId,\n      type,\n      metadata,\n    },\n    liaisonId,\n    liaisonJudgement,\n    ipfsContentId,\n    joystreamContentId,\n    videomediaDataObject {\n      id,\n      createdAt,\n      updatedAt,\n      channelId,\n      categoryId,\n      title,\n      description,\n      duration,\n      thumbnailPhotoDataObjectId,\n      thumbnailPhotoUrls,\n      thumbnailPhotoAvailability,\n      languageId,\n      hasMarketing,\n      publishedBeforeJoystream,\n      isPublic,\n      isCensored,\n      isExplicit,\n      licenseId,\n      mediaDataObjectId,\n      mediaUrls,\n      mediaAvailability,\n      mediaMetadataId,\n      createdInBlock,\n      isFeatured,\n    },\n }\n}`

  const { data } = await axios.post(hydraLocation, { query });
  //console.log(data)
  return data.data.dataObjects;
};
