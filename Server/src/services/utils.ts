export function transformMessageDBObject(dbObject: any) {
  const { content, messageType } = dbObject;
  const origin = messageType === "ai" ? "ai" : "user";
  return {
    message: content,
    origin: origin,
  };
}
export function transformArrayOfDBObjects(dbObjectsArray : any) {
  return dbObjectsArray.map(transformMessageDBObject);
}