import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import User from './user.model';
import Photo from './photo.model';

// PhotoRecipient attributes interface
interface PhotoRecipientAttributes {
  id: number;
  photo_id: number;
  recipient_id: number;
  viewed_at?: Date;
  created_at: Date;
}

// PhotoRecipient creation attributes interface
interface PhotoRecipientCreationAttributes extends Optional<PhotoRecipientAttributes, 'id' | 'created_at' | 'viewed_at'> {}

// PhotoRecipient model class
class PhotoRecipient extends Model<PhotoRecipientAttributes, PhotoRecipientCreationAttributes> implements PhotoRecipientAttributes {
  public id!: number;
  public photo_id!: number;
  public recipient_id!: number;
  public viewed_at?: Date;
  public created_at!: Date;
}

// Initialize PhotoRecipient model
PhotoRecipient.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    photo_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'photos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recipient_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    viewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PhotoRecipient',
    tableName: 'photo_recipients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['photo_id', 'recipient_id'],
      },
      {
        fields: ['viewed_at'],
      },
    ],
  }
);

// Define associations
PhotoRecipient.belongsTo(Photo, { foreignKey: 'photo_id', as: 'photo' });
PhotoRecipient.belongsTo(User, { foreignKey: 'recipient_id', as: 'recipient' });
Photo.hasMany(PhotoRecipient, { foreignKey: 'photo_id', as: 'recipients' });
User.hasMany(PhotoRecipient, { foreignKey: 'recipient_id', as: 'received_photos' });

export default PhotoRecipient;
