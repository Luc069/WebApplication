CREATE TABLE users(
  user_id                       SERIAL PRIMARY KEY,
  user_email                    VARCHAR(255) NOT NULL UNIQUE,
  user_name                     VARCHAR(255) NOT NULL UNIQUE,
  user_password                 VARCHAR(255) NOT NULL,
  user_bio                      VARCHAR(255),
  user_profile_image            VARCHAR(255),
  user_password_reset_token     VARCHAR(255),
  user_new_password_update_date VARCHAR(255),
  user_new_username_update_date VARCHAR(255),
  user_email_verified           VARCHAR(255) NOT NULL,
  user_join_date                VARCHAR(255) NOT NULL
);

CREATE TABLE posts(
  post_group_id                 VARCHAR(255) NOT NULL,
  post_user_id                  INT NOT NULL,
  post_id uuid                  DEFAULT public.uuid_generate_v4() NOT NULL,
  post_description              VARCHAR(255) NOT NULL,
  post_image                    VARCHAR(255),
  post_created_at               VARCHAR(255) NOT NULL
);

CREATE TABLE groups(
  group_id uuid                 DEFAULT public.uuid_generate_v4() NOT NULL,
  group_admin_id                INT NOT NULL, 
  group_name                    VARCHAR(255) NOT NULL, 
  group_about                   VARCHAR(255) NOT NULL,
  group_profile_image           VARCHAR(255),
  group_created_at              VARCHAR(255) NOT NULL
);

CREATE TABLE groups_info(
  group_info_id                 VARCHAR(255) NOT NULL,
  group_info_member             INT NOT NULL
);