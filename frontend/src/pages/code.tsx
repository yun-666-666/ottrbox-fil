import {
  Button,
  Center,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import Meta from "../components/Meta";
import useTranslate from "../hooks/useTranslate.hook";
import shareService from "../services/share.service";

const PasscodePage = () => {
  const router = useRouter();
  const t = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object().shape({
    passcode: yup.string().trim().required(t("common.error.field-required")),
  });

  const form = useForm({
    initialValues: {
      passcode: "",
    },
    validate: yupResolver(validationSchema),
  });

  const onSubmit = form.onSubmit(async (values) => {
    form.clearFieldError("passcode");
    setIsSubmitting(true);

    try {
      const passcode = await shareService.openPasscode(values.passcode);
      router.push(`/share/${passcode}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        form.setFieldError("passcode", t("passcode.error.invalid"));
        return;
      }

      if (error instanceof Error && error.message === "missing_passcode") {
        form.setFieldError("passcode", t("passcode.error.missing"));
        return;
      }

      form.setFieldError("passcode", t("common.error.unknown"));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <Meta title={t("passcode.title")} />
      <Center>
        <Paper
          withBorder
          p="lg"
          radius="md"
          sx={{ width: "100%", maxWidth: 460 }}
        >
          <form onSubmit={onSubmit}>
            <Stack>
              <div>
                <Title order={2}>{t("passcode.title")}</Title>
                <Text size="sm" color="dimmed">
                  {t("passcode.description")}
                </Text>
              </div>
              <TextInput
                variant="filled"
                label={t("passcode.input.label")}
                placeholder={t("passcode.input.placeholder")}
                {...form.getInputProps("passcode")}
              />
              <Button type="submit" loading={isSubmitting}>
                <FormattedMessage id="passcode.button.open" />
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </>
  );
};

export default PasscodePage;
