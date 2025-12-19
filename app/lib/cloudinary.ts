export const uploadToCloudinary = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset");
  formData.append("folder", folder);

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dscy8htb3/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
};
