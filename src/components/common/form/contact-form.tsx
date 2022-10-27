import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { useRouter } from "next/router";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>();

  function onSubmit(values: ContactFormValues) {
    console.log("contact me");
    console.log(values, "contact");

    axios("https://portal.day2daywholesale.comus", {
      method: "POST",
      data: {
        contact_name: values.name,
        contact_email: values.email,
        contact_subject: values.subject,
        contact_message: values.message,
      },
    })
      .then(() => {
        alert("Form Submitted");
        setTimeout(() => {
          router?.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const { t } = useTranslation();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto flex flex-col justify-center "
      noValidate
    >
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
          <Input
            labelKey="forms:label-name-required"
            placeholderKey="forms:placeholder-name"
            {...register("name", { required: "forms:name-required" })}
            className="w-full md:w-1/2 "
            errorKey={errors.name?.message}
            variant="solid"
          />
          <Input
            labelKey="forms:label-email-required"
            type="email"
            placeholderKey="forms:placeholder-email"
            {...register("email", {
              required: "forms:email-required",
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "forms:email-error",
              },
            })}
            className="w-full md:w-1/2 md:ms-2.5 lg:ms-5 mt-2 md:mt-0"
            errorKey={errors.email?.message}
            variant="solid"
            id="email-checkout-form"
          />
        </div>
        <Input
          labelKey="forms:label-subject"
          {...register("subject", { required: "forms:name-subject" })}
          className="relative"
          placeholderKey="forms:placeholder-subject"
          errorKey={errors.subject?.message}
          variant="solid"
        />
        <TextArea
          labelKey="forms:label-message"
          {...register("message")}
          className="relative mb-4"
          placeholderKey="forms:placeholder-message"
          inputClassName="text-black"
        />
        <div className="relative">
          <Button
            type="submit"
            className="h-12 lg:h-14 mt-1 text-sm lg:text-base w-full sm:w-auto bg-gradient-to-tr to-orange-500 from-orange-800"
          >
            {t("common:button-send-message")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
