import { Request, Response } from 'express';

export class MomentController {
  public async createMomentPlaceholder(req: Request, res: Response): Promise<Response> {
    const { thumbnail_url, recipients, overlays } = req.body;

    // No database interaction or external service calls

    return res.status(201).json({
      status: 'success',
      message: 'Placeholder: Moment data received successfully by local API.',
      data_received: {
        thumbnail_url,
        recipients,
        overlays,
      },
    });
  }
}
