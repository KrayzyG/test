import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';

// UserSetting attributes interface
interface UserSettingAttributes {
  id: number;
  user_id: number;
  notification_photo: boolean;
  notification_friend: boolean;
  notification_system: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  auto_save_photos: boolean;
  created_at: Date;
  updated_at: Date;
}

// UserSetting creation attributes interface
interface UserSettingCreationAttributes extends Optional<UserSettingAttributes, 'id' | 'created_at' | 'updated_at' | 'notification_photo' | 'notification_friend' | 'notification_system' | 'theme' | 'language' | 'auto_save_photos'> {}

// UserSetting model class
class UserSetting extends Model<UserSettingAttributes, UserSettingCreationAttributes> implements UserSettingAttributes {
  public id!: number;
  public user_id!: number;
  public notification_photo!: boolean;
  public notification_friend!: boolean;
  public notification_system!: boolean;
  public theme!: 'light' | 'dark' | 'system';
  public language!: string;
  public auto_save_photos!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize UserSetting model
UserSetting.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    notification_photo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notification_friend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notification_system: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark', 'system'),
      allowNull: false,
      defaultValue: 'system',
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
    },
    auto_save_photos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'UserSetting',
    tableName: 'user_settings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define associations
UserSetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(UserSetting, { foreignKey: 'user_id', as: 'settings' });

export default UserSetting;
